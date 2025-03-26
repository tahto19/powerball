import "dotenv/config";

import Fastify from "fastify";
import fs from "fs";
import fp from "fastify-plugin";
import cors from "@fastify/cors";

import conn from "./dbConnections/conn.js";

import userRoute from "./routes/User/user.route.js";
import LoginRoute from "./routes/Login/Login.route.js";
import PrizeListRoute from "./routes/PrizeList/PrizeList.route.js";

import { logger } from "./util/util.js";
import { auth } from "./authentication/auth.js";
import bodyChecker from "./helpers/bodyChecker.js";
import bodyEncrypt from "./helpers/bodyEncrypt.js";

const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
      },
      levels: "debug",
    },
  },
});
/**
 * Error code
 * X1 = FETCH 1 NO FILTER IS SET
 * X2 = requests post has no body
 * X3 = requests put has no body
 * X4 = requests delete has no body
 * X33 = jwtVerfiy is invalid
 * X44 = decryptCookie is invalid
 * X55 = no user found using cookie
 * ErroCODE X66 = expired cookie
 * X999 = login wrong credentials
 */
const start = async () => {
  try {
    // cors
    // await fastify.register(cors, {
    //   origin: "*",
    //   methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    // });
    await fastify.register(cors, {
      origin: ["http://localhost:5173"],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true, // ✅ Allow cookies
    });
    // jwt
    fastify.register(import("@fastify/jwt"), {
      secret: process.env.JWT_SECRET,
    });
    //cookie setter
    fastify.register(import("@fastify/cookie"), {
      secret: process.env.COOKIE_SECRET, // for cookies signature
      hook: "onRequest", // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
      parseOptions: {}, // options for parsing cookies
    });
    // multipart
    fastify.register(import("@fastify/multipart"), {
      limits: {
        fieldNameSize: 100, // Max field name size in bytes
        fieldSize: 100, // Max field value size in bytes
        fields: 10, // Max number of non-file fields
        fileSize: 1000000, // For multipart forms, the max file size in bytes
        files: 1, // Max number of file fields
        headerPairs: 2000, // Max number of header key=>value pairs
        parts: 1000, // For multipart forms, the max number of parts (fields + files)
      },
    });
    // authentication part here

    fastify
      // .decorate("fastify1", fastify)
      .decorateRequest("jwtVerfiy", {
        getter() {
          return fastify.jwt.verify;
        },
      })
      .addHook("onRequest", auth)
      .addHook("preHandler", bodyChecker)
      .addHook("onSend", bodyEncrypt);

    /**
     *
     * API checker if can access
     */

    // await fastify
    //   .register(import("@fastify/middie"))
    //   .register(fp(urlPatchChecker), {
    //     json: JSON.parse(urlpathcheckerconfig),
    //   });

    /**
     * routes
     */
    fastify.register(LoginRoute, { prefix: "api/login" });
    fastify.register(userRoute, { prefix: "api/users" });
    fastify.register(PrizeListRoute, { prefix: "api/prize-list" });

    /**
     *error handler
     */
    fastify.setErrorHandler((err, req, res) => {
      logger.error(err);
      if (err.code === undefined) {
        res.status(400).send({ result: "error", message: err.message });
      } else
        res
          .status(err.code)
          .send({ result: "error", message: err.message, err });
    });

    fastify.listen({ port: process.env.PORT }, function (err, address) {
      if (err) {
        fastify.log.error(err);
        process.exit(1);
      }
      // Server is now listening on ${address}
    });

    const connected = await conn.auth();
    if (connected) {
      await conn.auth();
      await conn.sync();
    }

    await fastify.ready();
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
