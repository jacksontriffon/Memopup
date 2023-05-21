import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import openai from "~/utils/openai";

export const openaiRouter = createTRPCRouter({
  getChatTitle: protectedProcedure
    .input(
      z.object({
        message: z.string(),
        aiModel: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { message } = input;
      try {
        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content:
                "Generate a title of a chat (Maximum of 3 words, and no special characters) with the following message: " +
                message,
            },
          ],
        });
        const generatedTitle = response.data.choices[0];
        const responseJSON = { title: generatedTitle?.message?.content ?? "" };
        return responseJSON;
      } catch (error) {
        console.error("Error:", error);
      }
    }),
});
