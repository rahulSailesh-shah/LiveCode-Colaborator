import { Contest } from "./Contest";
import {
  CODE_CHANGE,
  INIT_CONTEST,
  JOIN_ROOM,
  CODE_SUBMIT,
  USER_JOINED,
  JOIN_REQUEST,
  ACCEPT_REQUEST,
  DECLINE_REQUEST,
  CONTEST_FULL,
} from "./messages";
import { UserType } from "./types";
import { User } from "./User";

export class ContestManager {
  private contests: Contest[];
  private users: User[];

  constructor() {
    this.contests = [];
    this.users = [];
  }

  addUsers(user: User) {
    console.log("New user connected");
    this.users.push(user);
    const broadcastMessage = {
      type: "user_joined",
      payload: {
        userId: user.id,
      },
    };
    user.socket.send(JSON.stringify(broadcastMessage));

    this.handler(user);
  }

  removeUser(userId: string) {
    // TODO: Logic to remove user if participant leaves and update status
  }

  initContest(user: User, contestId: string) {
    const contest = new Contest(user, contestId);
    this.contests.push(contest);
    console.log("NEW CONTEST CREATED\n CONTEST ID: ", contest.id);

    const message = {
      type: "room_created",
      payload: {
        contestId: contest.id,
      },
    };
    contest.broadcast(message, [user]);
  }

  handleCodeChange(user: User, code: string, contestId: string) {
    const contest = this.contests.find(
      (x) =>
        x.id === contestId &&
        (x.participant1.id === user.id || x.participant2?.id === user.id)
    );
    if (!contest) {
      console.log("Contest not found");
      return;
    }
    console.log(`[.] ${user.id} CODE: ${code}, CONTEST_ID: ${contest.id}`);
    contest.code = code;

    const broadcastMessage = {
      type: "code_change",
      payload: {
        code,
        contestId,
      },
    };
    const otherUser: UserType | undefined =
      contest.participant1.id === user.id
        ? contest.participant2
        : contest.participant1;
    if (!otherUser) {
      console.log("Other user not found");
      return;
    }
    contest.broadcast(broadcastMessage, [otherUser]);
  }

  handleCodeSubmit(user: User, codeId: string) {
    const contest = this.contests.find(
      (x) => x.participant1.id === user.id || x.participant2?.id === user.id
    );
    if (!contest) {
      console.log("You are not in a contest");
      return;
    }

    contest.submitCode(codeId);
  }

  handler(user: User) {
    user.socket.on("message", async (data) => {
      const message = JSON.parse(data.toString());

      console.log("INCOMING MESSAGE\n", message);

      if (message.type === INIT_CONTEST) {
        this.initContest(user, message.payload.contestId);
      }

      if (message.type === CODE_CHANGE) {
        if (!message.payload.code || message.payload.code === "") {
          console.log("Code not provided");
          return;
        }
        this.handleCodeChange(
          user,
          message.payload.code,
          message.payload.contestId
        );
      }

      if (message.type === CODE_SUBMIT) {
        if (!message.payload.codeID) {
          console.log("Code ID not provided");
          return;
        }
        this.handleCodeSubmit(user, message.payload.codeID);
      }

      if (message.type === JOIN_ROOM) {
        const { contestId, userId } = message.payload;
        const contest = this.contests.find(
          (contest) => contest.id === contestId
        );
        if (!contest) {
          console.log("Contest not found");
          return;
        }
        if (contest.participant2 && contest.participant1) {
          console.log("Contest is full");
          return;
        }
        const participant2 = this.users.find((user) => user.id === userId);
        if (!participant2) {
          console.log("User not found");
          return;
        }

        contest.participant2 = participant2;
        const broadcastMessage = {
          type: USER_JOINED,
          payload: {
            contestId,
          },
        };

        contest.broadcast(broadcastMessage, [
          contest.participant1,
          contest.participant2,
        ]);
      }
    });
  }
}
