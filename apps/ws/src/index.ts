import { WebSocketServer, WebSocket } from "ws";
import { ContestManager } from "./ContestManager";
import { SignalingServer } from "./SignalHandler";
import cors from "cors";
import express from "express";
import https from "https";
import url from "url";
import dotenv from "dotenv";
import { randomUUID } from "crypto";
import { UserType } from "./types";
import { Contest } from "./Contest";

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

const server = https.createServer(app);
const wss = new WebSocketServer({ server });

const contestManager = new ContestManager();
const signalingServer = new SignalingServer();

wss.on("connection", async (ws: WebSocket, req: any) => {
  ws.on("error", console.error);

  const { contestId, userId } = url.parse(req.url!, true).query;
  if (!contestId) {
    console.log("Contest ID not found");
    return;
  }

  const newUser: UserType = {
    name: "user",
    id: userId as string,
    socket: ws,
  };

  contestManager.updateContest(newUser, contestId as string);

  // Handle signaling messages
  signalingServer.handle(ws);

  ws.on("close", () => {
    contestManager.removeUser(userId as string);
  });
});

app.post("/contest", (req, res) => {
  const contestId = randomUUID();
  const contest = new Contest(contestId);
  contestManager.addContest(contest);
  res.send({ id: contestId });
});

app.get("/contest/:id", (req, res) => {
  const contest = contestManager.getContest(req.params.id);
  if (!contest) {
    res.status(404).json({ error: "Contest not found" });
    return;
  }
  res.send({ id: contest.id });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
