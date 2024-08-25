import { EXECUTING_CODE } from "./messages";
import { UserType } from "./types";
import { CodeExecution } from "./CodeExecution";

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
    let message = {
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

    const codeExeutor = new CodeExecution(this.code, codeId);
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
    this.broadcast(payloadMessage, participants);
  }

  broadcast(message: any, users: UserType[]) {
    users?.forEach((user) => {
      user.socket.send(JSON.stringify(message));
    });
  }
}
