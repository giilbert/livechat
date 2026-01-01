import z from "zod";

export const createChatSchema = z.object({
  name: z.string().min(1).max(100),
});
