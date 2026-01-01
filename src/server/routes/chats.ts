import { createChatSchema } from "@/lib/schemas";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const chatRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const chats = await ctx.prisma.chat.findMany({
      where: { members: { some: { userId: ctx.user.id } } },
      select: { id: true, name: true },
    });

    return chats;
  }),

  create: protectedProcedure
    .input(createChatSchema)
    .mutation(async ({ ctx, input }) => {
      const chat = await ctx.prisma.chat.create({
        data: {
          name: input.name,
          members: { create: { userId: ctx.user.id } },
        },
      });

      return chat;
    }),
});
