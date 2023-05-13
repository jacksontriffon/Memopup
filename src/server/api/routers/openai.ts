import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const openaiRouter = createTRPCRouter({
  getChats: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.chat.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  createChat: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        aiModel: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.chat.create({
        data: {
          ...input,
          user: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  // updateFullName: protectedProcedure
  //   .input(
  //     z.object({
  //       id: z.string(),
  //       firstName: z.string(),
  //       middleName: z.string(),
  //       lastName: z.string(),
  //       title: z.string(),
  //       pronouns: z.string(),
  //     })
  //   )
  //   .mutation(({ ctx, input }) => {
  //     return ctx.prisma.fullname.update({
  //       data: { ...input },
  //       where: {
  //         id: input.id,
  //       },
  //     });
  //   }),

  // deleteFullName: protectedProcedure
  //   .input(
  //     z.object({
  //       fullNameID: z.string(),
  //     })
  //   )
  //   .mutation(({ ctx, input }) => {
  //     return ctx.prisma.fullname.delete({
  //       where: {
  //         id: input.fullNameID,
  //       },
  //     });
  //   }),
});
