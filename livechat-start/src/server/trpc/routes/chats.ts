import { createChatSchema } from "@/lib/schemas";
import { authedProcedure } from "../auth-middleware";
import { router } from "../trpc-config";
import { chat, chatMember, user } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const chatRouter = router({
  list: authedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({
        id: chat.id,
        name: chat.name,
        createdAt: chat.createdAt,
      })
      .from(chat)
      .innerJoin(chatMember, eq(chat.id, chatMember.chatId))
      .innerJoin(user, eq(chatMember.userId, user.id))
      .where(eq(user.id, ctx.user.id));
  }),

  create: authedProcedure
    .input(createChatSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        const newChat = await tx
          .insert(chat)
          .values({ name: input.name })
          .returning({ id: chat.id })
          .get();

        await tx.insert(chatMember).values({
          chatId: newChat.id,
          userId: ctx.user.id,
        });

        return newChat.id;
      });
    }),
});
