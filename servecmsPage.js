import Fastify from "fastify";
import path from "path";
import fastifyStatic from "@fastify/static";
import cors from "@fastify/cors";

const fastify = Fastify();
const start = () => {
  try {
    console.log(path.join(process.cwd(), "/client/dist"));
    fastify.register(fastifyStatic, {
      root: path.join(process.cwd(), "/client/dist"), // This is where your Vue.js build output is located
    });
    fastify.register(cors, {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true, // ✅ Allow cookies
    });
    fastify.setNotFoundHandler((request, reply) => {
      const url = request.raw.url;
      if (url !== undefined && url.startsWith("/api")) {
        throw fastify.httpErrors.notFound(`${url} not found`);
      } else {
        void reply.sendFile("index.html");
      }
    });
    fastify.listen({ port: 5000 }, (err, address) => {
      if (err) throw err;
      console.log("server is running at port 5000");
      // Server is now listening on ${address}
    });
  } catch (err) {
    console.log(err);
  }
};
console.log("Starting....");
start();
