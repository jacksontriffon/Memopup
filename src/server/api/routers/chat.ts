import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const chatRouter = createTRPCRouter({
  // Chat CRUD
  getAllChats: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.chat.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  getChatFromID: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.chat.findUnique({
        where: {
          id: input.chatId,
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

  // updateChat: protectedProcedure
  //   .input(
  //     z.object({
  //       id: z.string(),
  //       title: z.string(),
  //       aiModel: z.string(),
  //       messages: z.array(prisma.message)
  //     })
  //   )
  //   .mutation(({ ctx, input }) => {
  //     return ctx.prisma.chat.update({
  //       data: { ...input },
  //       where: {
  //         id: input.id,
  //       },
  //     });
  //   }),

  deleteChat: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const deletedMessages = ctx.prisma.message.deleteMany({
        where: {
          chatId: input.chatId,
        },
      });
      const deletedChat = ctx.prisma.chat.delete({
        where: {
          id: input.chatId,
        },
      });
      return deletedChat;
    }),

  // MESSAGE CRUD
  getChatMessages: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.message.findMany({
        where: {
          chatId: input.chatId,
        },
      });
    }),

  // getMessage: protectedProcedure.query(({ ctx }) => {
  //   return ctx.prisma.chat.findUnique({
  //     where: {

  //     },
  //   });
  // }),

  createMessage: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        chatId: z.string(),
        senderName: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.message.create({
        data: {
          ...input,
        },
      });
    }),

  // updateChat: protectedProcedure
  //   .input(
  //     z.object({
  //       id: z.string(),
  //       title: z.string(),
  //       aiModel: z.string(),
  //       messages: z.array(prisma.message)
  //     })
  //   )
  //   .mutation(({ ctx, input }) => {
  //     return ctx.prisma.chat.update({
  //       data: { ...input },
  //       where: {
  //         id: input.id,
  //       },
  //     });
  //   }),

  deleteMessage: protectedProcedure
    .input(
      z.object({
        messageId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.message.delete({
        where: {
          id: input.messageId,
        },
      });
    }),
});
