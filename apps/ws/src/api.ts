import axios from "axios";

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
      "X-RapidAPI-Key": "b53dc7051amsh95e2a570b57614cp170816jsn07e481a818cc",
      "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
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
      "X-RapidAPI-Key": "b53dc7051amsh95e2a570b57614cp170816jsn07e481a818cc",
      "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
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
