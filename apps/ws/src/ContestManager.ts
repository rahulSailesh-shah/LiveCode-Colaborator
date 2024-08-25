import { Contest } from "./Contest";
import { CODE_SUBMIT } from "./messages";
import { User } from "./User";

export class ContestManager {
  private contests: Contest[];

  constructor() {
    this.contests = [];
  }

  addContest(contest: Contest) {
    console.log("NEW CONTEST CREATED");
    this.contests.push(contest);
    console.log("TOTAL CONTESTS: ", this.contests.length);
  }

  updateContest(user: User, contestId: string) {
    const contest = this.contests.find((x) => x.id === contestId);
    if (!contest) {
      console.log("Contest not found");
      return;
    }
    contest.participants.push(user);
    console.log(`USER : ${user.id} ADDED TO CONTEST: ${contestId}`);
    this.handler(user);
  }

  removeUser(userId: string) {
    // TODO: Logic to remove user if participant leaves and update status
  }

  handleCodeSubmit(code: string, codeId: string, contestId: string) {
    const contest = this.contests.find((x) => x.id === contestId);
    if (!contest) {
      console.log("You are not in a contest");
      return;
    }
    contest.submitCode(code, codeId);
  }

  handler(user: User) {
    user.socket.on("message", async (data) => {
      const message = JSON.parse(data.toString());

      console.log("INCOMING MESSAGE\n", message);

      if (message.type === CODE_SUBMIT) {
        const { code, codeId, contestId } = message.payload;
        if (!code || !codeId || !contestId) {
          console.log("Invalid code submission");
          return;
        }
        this.handleCodeSubmit(code, codeId, contestId);
      }
    });
  }
}
