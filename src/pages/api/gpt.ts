import type { NextApiRequest, NextApiResponse } from "next";
import openai from "~/utils/openai";

interface GenerateChatTitleRequestBody {
  message: string;
}

interface GenerateChatTitleResponseBody {
  title: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GenerateChatTitleResponseBody | { error: string }>
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed. Use GET instead." });
    return;
  }
  const { message } = req.body as GenerateChatTitleRequestBody;
  if (typeof message !== "string") {
    res.status(400).json({ error: "Invalid message format" });
    return;
  }
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content:
            "Generate a title of a chat (Maximum of 3 words) with the following message: " +
            message,
        },
      ],
    });
    const generatedTitle = response.data.choices[0];
    const responseJSON = { title: generatedTitle?.message?.content ?? "" };
    res.status(200).json(responseJSON);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
