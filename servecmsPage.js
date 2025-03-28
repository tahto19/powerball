import Fastify from "fastify";
import path from "path";
import fastifyStatic from "@fastify/static";
import cors from "@fastify/cors";

const fastify = Fastify();
const start = () => {
  console.log(path.join(process.cwd(), "/client/dist"));
  fastify.register(fastifyStatic, {
    root: path.join(process.cwd(), "/client/dist"), // This is where your Vue.js build output is located
    prefix: "/", // Serve files under the root path
  });
  fastify.register(cors, {
    origin: "*",
    // methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true, // ✅ Allow cookies
  });
  fastify.route({
    method: "GET",
    url: "*",
    handler: async function (request, reply) {
      return reply.sendFile("index.html"); // Serve the index.html for SPA routing
    },
  });
  //   fastify.get("/*", async (request, reply) => {
  //     return reply.sendFile("index.html"); // Serve the index.html for SPA routing
  //   });
  //   fastify.head("/*", (request, reply) => {
  //     // Handle HEAD requests, if needed
  //     return reply.send();
  //   });
  fastify.listen({ port: 5000 }, (err, address) => {
    if (err) throw err;
    console.log("server is running at port 5000");
    // Server is now listening on ${address}
  });
};
console.log("Starting....");
start();
