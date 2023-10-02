import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { appRouter } from "./router";

const server = createHTTPServer({
  router: appRouter,
  middleware: cors(),
});

console.log("starting local server");

server.listen(3000);
