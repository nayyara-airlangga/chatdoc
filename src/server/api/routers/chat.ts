import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { documentTypes, chats } from "~/server/db/schema";
import { ulid } from "~/lib/ulid";

export const chatRouter = createTRPCRouter({
  createChat: protectedProcedure
    .input(
      z.object({
        docName: z.string().min(1).max(255),
        docType: z.enum(documentTypes.enumValues),
        docKey: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { docName, docType, docKey } = input;

      return (
        await ctx.db
          .insert(chats)
          .values({
            id: ulid(),
            userId: ctx.session.user.id,
            docName,
            docType,
            docKey,
          })
          .returning()
      )[0]!;
    }),
});
