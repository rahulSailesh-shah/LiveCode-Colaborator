import WebSocket from "ws";

interface Message {
  type: string;
  topics?: string[];
  topic?: string;
  clients?: number;
  [key: string]: any;
}

export class SignalingServer {
  private topics: Map<string, Set<WebSocket>> = new Map();

  public handle(socket: WebSocket & { isAlive?: boolean }): void {
    socket.isAlive = true;
    const subscribedTopics: Set<string> = new Set();

    socket.on("message", (data: WebSocket.Data) => {
      const message: Message = JSON.parse(data.toString());

      switch (message.type) {
        case "subscribe":
          this.handleSubscribe(message, socket, subscribedTopics);
          break;
        case "publish":
          this.handlePublish(message, socket);
          break;
        case "unsubscribe":
          this.handleUnsubscribe(message, socket);
          break;
        case "ping":
          this.handlePing(socket);
          break;
        default:
          console.log(`Unhandled message: ${JSON.stringify(message)}`);
          break;
      }
    });

    socket.on("close", (code: number) => {
      this.handleClose(socket, subscribedTopics, code);
    });
  }

  private handleSubscribe(
    message: Message,
    socket: WebSocket,
    subscribedTopics: Set<string>
  ): void {
    message.topics?.forEach((topicName) => {
      subscribedTopics.add(topicName);
      const subscribers = this.topics.get(topicName) || new Set<WebSocket>();
      subscribers.add(socket);
      if (!this.topics.has(topicName)) {
        this.topics.set(topicName, subscribers);
      }
    });
  }

  private handlePublish(message: Message, socket: WebSocket): void {
    if (message.topic) {
      const subscribers =
        this.topics.get(message.topic) || new Set<WebSocket>();
      message.clients = subscribers.size;
      subscribers.forEach((subscriber) => {
        if (socket !== subscriber) {
          subscriber.send(JSON.stringify(message));
        }
      });
    }
  }

  private handleUnsubscribe(message: Message, socket: WebSocket): void {
    message.topics?.forEach((topicName) => {
      const subscribers = this.topics.get(topicName);
      if (subscribers) {
        subscribers.delete(socket);
      }
    });
  }

  private handlePing(socket: WebSocket & { isAlive?: boolean }): void {
    socket.send(JSON.stringify({ type: "pong" }));
    socket.isAlive = true;
  }

  private handleClose(
    socket: WebSocket,
    subscribedTopics: Set<string>,
    code: number
  ): void {
    subscribedTopics.forEach((topicName) => {
      const subscribers = this.topics.get(topicName) || new Set<WebSocket>();
      subscribers.delete(socket);
      if (subscribers.size === 0) {
        this.topics.delete(topicName);
      }
    });
    subscribedTopics.clear();

    if (code === 1005) {
      socket.terminate();
    }
  }

  public startHeartbeat(wss: WebSocket.Server): void {
    setInterval(() => {
      wss.clients.forEach((socket: WebSocket & { isAlive?: boolean }) => {
        if (socket.isAlive === false) return socket.terminate();
        socket.isAlive = false;
      });
    }, 30000);
  }
}
