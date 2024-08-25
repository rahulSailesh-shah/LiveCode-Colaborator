import { randomUUID } from "crypto";
import { WebSocket } from "ws";
import { connect } from "http2";
import {
  CODE_QUEUE,
  SUBMISSION_RESULT,
  SUBMISSION_TOKEN,
  EXECUTING_CODE,
} from "./messages";
import { UserType } from "./types";

export class Contest {
  public id: string;
  public startTime: Date = new Date();
  public participant1: UserType;
  public participant2: UserType | undefined;
  public code: string = "";

  constructor(participant1: UserType, contestID: string, startTime?: Date) {
    this.participant1 = participant1;
    this.participant2 = undefined;
    this.id = contestID;
  }

  async submitCode(codeId: string) {
    const message = {
      type: EXECUTING_CODE,
      payload: {
        codeId,
        contestId: this.id,
      },
    };
    const participants = [
      this.participant1,
      ...(this.participant2 ? [this.participant2] : []),
    ];
    this.broadcast(message, participants);
  }

  broadcast(message: any, users: UserType[]) {
    users?.forEach((user) => {
      user.socket.send(JSON.stringify(message));
    });
  }
}
