import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function postSubmission(code: string, language_id: number) {
  const options = {
    method: "POST",
    url: "https://judge0-ce.p.rapidapi.com/submissions",
    params: {
      base64_encoded: "true",
      fields: "*",
    },
    headers: {
      "content-type": "application/json",
      "Content-Type": "application/json",
      "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
      "X-RapidAPI-Host": process.env.JUDGE0_API_HOST,
    },
    data: {
      language_id: language_id,
      source_code: code,
    },
  };
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error: any) {
    console.log("POST SUBMISSION API ERROR", error.response.data);
    return error;
  }
}

export async function getSubmission(token: string) {
  const options = {
    method: "GET",
    url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
    params: {
      base64_encoded: "true",
      fields: "*",
    },
    headers: {
      "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
      "X-RapidAPI-Host": process.env.JUDGE0_API_HOST,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error: any) {
    console.log("GET SUBMISSION API ERROR", error.response.data);
    return error;
  }
}
