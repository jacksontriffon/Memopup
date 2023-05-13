import type { NextApiRequest, NextApiResponse } from "next";
import openai from "~/utils/openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //   const response = await openai.createChatCompletion({
  //     model: "gpt-3.5-turbo",
  //     messages: [
  //       {
  //         role: "user",
  //         content:
  //           "Memopup is an adorable puppy who can talk! What does memopup say to greet you? Be cuter and speak like a 10 year old",
  //       },
  //     ],
  //   });
  //   const responseText = response.data.choices[0];

  // res.status(200).json(responseText);
  const models = await openai.listModels();
  res.status(200).json(models.data.data);
}
