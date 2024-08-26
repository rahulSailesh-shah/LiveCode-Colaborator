import { WebSocketServer, WebSocket } from "ws";
import { ContestManager } from "./ContestManager";
import cors from "cors";

import url from "url";
// import { extractUserId } from "./auth";
import dotenv from "dotenv";
import express from "express";
import { randomUUID } from "crypto";
import { UserType } from "./types";
import { Contest } from "./Contest";

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

const wss = new WebSocketServer({ port: 8080 });

const contestManager = new ContestManager();

wss.on("connection", async (ws: WebSocket, req: Request) => {
  ws.on("error", console.error);

  const { contestId } = url.parse(req.url, true).query;
  if (!contestId) {
    console.log("Contest ID not found");
    return;
  }

  const newUser: UserType = {
    name: "user",
    id: randomUUID(),
    socket: ws,
  };

  contestManager.updateContest(newUser, contestId as string);

  ws.on("close", (data: string) => {
    contestManager.removeUser(data);
  });
});

app.post("/contest", (req, res) => {
  const contestId = randomUUID();
  const contest = new Contest(contestId);
  contestManager.addContest(contest);
  res.send({ id: contestId });
});

app.get("/contest/:id", (req, res) => {
  console.log("new request");
  const contest = contestManager.getContest(req.params.id);
  if (!contest) {
    res.status(404).json({ error: "Contest not found" });
    return;
  }
  console.log(contest.id);
  res.send({ id: contest.id });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
