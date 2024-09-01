import { getSubmission, postSubmission } from "./api";

interface User {
  id: string;
  name: string;
  socket: WebSocket;
}

export class CodeExecution {
  public code: string;
  public codeId: string;
  public status: string;

  constructor(code: string, codeId: string) {
    this.code = code;
    this.codeId = codeId;
    this.status = "";
  }

  public async createSubmission() {
    try {
      const base64Code = Buffer.from(this.code).toString("base64");
      const languageId = parseInt(this.codeId);
      const response = await postSubmission(base64Code, languageId);
      const result = await this.pollSubmission(response.token);
      console.log(result);
      return result;
    } catch (error) {
      console.log("CREATE SUBMISSION ERROR: ", error);
      return "Something went wrong while creating submission.";
    }
  }

  private async pollSubmission(submissionToken: string) {
    try {
      let statusID: number = 1;
      let result: any;
      while (statusID === 1 || statusID === 2) {
        result = await getSubmission(submissionToken);
        statusID = result.status.id;
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
      return result;
    } catch (error) {
      console.log("POLL SUBMISSION ERROR: ", error);
      return "Something went wrong while polling submission.";
    }
  }
}
