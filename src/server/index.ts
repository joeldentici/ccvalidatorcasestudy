import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { appRouter } from "./router";

const server = createHTTPServer({
  router: appRouter,
  middleware: cors(),
});

server.listen(3000);
