import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const promptRouter = createTRPCRouter({
  // Prompt CRUD
  createPrompt: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        aiModel: z.string(),
        prefix: z.boolean(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.prompt.create({
        data: {
          ...input,
          user: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getAllPrompts: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.prompt.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  updatePrompt: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        userId: z.string(),
        title: z.string(),
        aiModel: z.string(),
        prefix: z.boolean(),
        content: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.prompt.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
        },
      });
    }),

  deletePrompt: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.prompt.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
