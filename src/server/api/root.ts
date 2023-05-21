import { createTRPCRouter } from "~/server/api/trpc";
import { chatRouter } from "~/server/api/routers/chat";
import { openaiRouter } from "~/server/api/routers/openai";
import { promptRouter } from "~/server/api/routers/prompt";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  chat: chatRouter,
  openai: openaiRouter,
  prompt: promptRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
