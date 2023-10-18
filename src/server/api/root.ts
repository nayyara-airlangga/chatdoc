import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "./routers/example";
import { documentRouter } from "./routers/document";
import { chatRouter } from "./routers/chat";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  chat: chatRouter,
  document: documentRouter,
  example: exampleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
