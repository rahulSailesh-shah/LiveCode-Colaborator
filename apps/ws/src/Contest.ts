import { EXECUTING_CODE } from "./messages";
import { UserType } from "./types";
import { CodeExecution } from "./CodeExecution";

export class Contest {
  public id: string;
  public participants: UserType[];

  constructor(contestID: string) {
    this.id = contestID;
    this.participants = [];
  }

  async submitCode(code: string, codeId: string) {
    let message = {
      type: EXECUTING_CODE,
      payload: {
        codeId,
        contestId: this.id,
      },
    };
    this.broadcast(message);

    const codeExeutor = new CodeExecution(code, codeId);
    const result = await codeExeutor.createSubmission();
    const output = result.stdout
      ? Buffer.from(result.stdout, "base64").toString("utf-8")
      : result.stderr
        ? Buffer.from(result.stderr, "base64").toString("utf-8")
        : "Error fetching output.";

    const payloadMessage = {
      type: "code_result",
      payload: {
        output,
        contestId: this.id,
      },
    };
    this.broadcast(payloadMessage);
  }

  broadcast(message: any) {
    this.participants.forEach((user) => {
      user.socket.send(JSON.stringify(message));
    });
  }
}
