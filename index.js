import "dotenv/config";

import Fastify from "fastify";

import cors from "@fastify/cors";

import conn from "./dbConnections/conn.js";

import userRoute from "./routes/User/User.route.js";
import LoginRoute from "./routes/Login/Login.route.js";
import PrizeListRoute from "./routes/PrizeList/PrizeList.route.js";
import GameMaintenace from "./routes/GameMaintenance/Raffle.route.js";
import FileEntries from "./routes/FileEntries/File.Route.js";
import CronJobs from "./routes/CronJobs/Cron.Route.js";
import winnerEntries from "./routes/winnerEntries/winnerEntries.route.js";

import { logger } from "./util/util.js";
import { auth } from "./authentication/auth.js";
import bodyChecker from "./helpers/bodyChecker.js";
import bodyEncrypt from "./helpers/bodyEncrypt.js";
import OTPRoute from "./routes/OTP/OTP.route.js";
import Associations from "./models/association/index.js";
import Ticket from "./routes/Ticket/Ticket.js";
import raffleHistory from "./routes/raffleHistory/raffleHistory.js";
import auditTrailAdder from "./helpers/auditTrailAdder.js";
import LogoutRoute from "./routes/Logout/Logout.route.js";
import TestingRoutes from "./routes/TestingRoutes/Test.route.js";
import PasswordResets from "./routes/PasswordResets/PasswordResets.route.js";
import { exportRoute } from "./routes/exports/Export.js";
import alphaCode from "./routes/AlphaCode/routes.js";
import Inquiry from "./routes/Inquiry/Inquiry.route.js";
import FreeTickets from "./routes/freeTickets/FreeTickets.route.js";
import userType from "./routes/UserType/UserType.route.js";
import { createSuperUser } from "./util/createSuperUser.js";

const fastify = Fastify({
  trustProxy: true,
  // logger: {
  //   transport: {
  //     target: "pino-pretty",
  //     options: {
  //       colorize: true,
  //     },
  //     levels: "debug",
  //   },
  // },
  logger: false,
});
/**
 * Error code
 * x11 not login
 * X1 = FETCH 1 NO FILTER IS SET
 * X2 = requests post has no body
 * X3 = requests put has no body
 * X4 = requests delete has no body
 * X33 = jwtVerfiy is invalid
 * X44 = decryptCookie is invalid
 * X55 = no user found using cookie
 * ErroCODE X66 = expired cookie
 * x231 = subject or to is not set
 * X556 = no code sent
 * x557 = no email found
 * x58 = code is invalid
 * x71 = Raffle ID already exists
 * x77 = already exists
 * x72 = Image does not exists
 * x73 = End date must be set in the future. Please choose a valid end date.
 * x74 = Draw date must be after end date.
 * x75 = Email does not exists.
 * x761 = Invalid token.
 * x762 = Reset token has already been used.
 * x763 = expired token.
 * x764 = Empty password.
 * X999 = login wrong credentials
 * x91c = not image
 * x909 = Email already exists error
 * x908 = Mobile NUmber already exists error
 * X741 = email details sender is incorrect
 * X891 = body checker json error incorrect data
 * X369 = entries is more than the total remaining entries
 * x268 no active ticket or no more entries
 * X984 invalid transaction in draw no prize_id or no raffle_id
 * X911 raffle is already have a winner
 * x098 the query has no id
 * x675 theres no entry on this ticket
 * X930 no alpha code
 * x138 the use is not admin
 * X921 no entries insert
 * x923 schema body is missing
 * x663 already have a winner cant join this event
 * x910 no user found
 * x933 this user is not allowed here
 * x876 all user already won
 */

/**
 * raffle details schedule type
 * 1 = daily
 * 2 = weekly
 */

/**
 * raffle details schedule status
 * 1 = done
 * 2 = active
 * 3 = inactive
 */

const start = async () => {
  try {
    // cors
    // await fastify.register(cors, {
    //   origin: "*",
    //   methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    // });
    await fastify.register(cors, {
      origin: (origin, cb) => {
        if (!origin) {
          // Allow no-origin requests (Postman, curl, some mobile apps)
          return cb(null, true);
        }

        let hostname = "";
        try {
          hostname = new URL(origin).hostname;
        } catch (err) {
          console.error("Failed to parse Origin:", origin);
          return cb(new Error("Invalid origin"));
        }

        const allowedHostnames = [
          "localhost",
          "18.138.76.86",
          "scratchit.com.ph",
        ];
        if (allowedHostnames.includes(hostname)) {
          return cb(null, true);
        } else {
          return cb(new Error("You are not allowed here"));
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true, // ✅ Allow cookies
    });
    // jwt
    fastify.register(import("@fastify/jwt"), {
      secret: process.env.JWT_SECRET,
    });
    //cookie setter
    fastify.register(import("@fastify/cookie"), {
      parseOptions: { sameSite: "lax" },
      secret: process.env.COOKIE_SECRET, // for cookies signature
      // hook: "onRequest", // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
      // parseOptions: {}, // options for parsing cookies
    });
    // multipart
    fastify.register(import("@fastify/multipart"), {
      limits: {
        fieldNameSize: 1000, // Max field name size in bytes
        fileSize: 10000000, // Max field value size in bytes
        fields: 50, // Max number of non-file fields
        fileSize: 10000000000, // For multipart forms, the max file size in bytes
        files: 2, // Max number of file fields
        headerPairs: 2000, // Max number of header key=>value pairs
        parts: 10000, // For multipart forms, the max number of parts (fields + files)
      },
      attachFieldsToBody: true,
    });
    // authentication part here

    fastify
      .decorate("fastify1", fastify)
      .decorateRequest("jwtVerfiy", {
        getter() {
          return fastify.jwt.verify;
        },
      })
      .addHook("onRequest", auth)
      .addHook("preParsing", bodyChecker)
      .addHook("onSend", bodyEncrypt);
    // .addHook("onResponse", auditTrailAdder);

    /**
     *
     * API checker if can access
     */

    // await fastify
    //   .register(import("@fastify/middie"))
    //   .register(fp(urlPatchChecker), {
    //     json: JSON.parse(urlpathcheckerconfig),
    //   });
    // const auditTrailConfig = fs.readFileSync(
    //   "./helpers/config/audittrailconfig.json",
    //   "utf8"
    // );
    // // audit trail
    // await fastify
    //   .register(import("@fastify/middie"))

    //   // register audit trail
    //   .register(fp(auditTrailAdder), {
    //     json: JSON.parse(auditTrailConfig),
    //   });
    /**
     * routes
     */
    fastify.register(LoginRoute, {
      prefix: process.env.ROUTES_PREFIX + "login",
    });
    fastify.register(userRoute, {
      prefix: process.env.ROUTES_PREFIX + "users",
    });
    fastify.register(PrizeListRoute, {
      prefix: process.env.ROUTES_PREFIX + "prize-list",
    });
    fastify.register(GameMaintenace, {
      prefix: process.env.ROUTES_PREFIX + "game-maintenance",
    });
    fastify.register(Ticket, { prefix: process.env.ROUTES_PREFIX + "ticket" });
    fastify.register(OTPRoute, { prefix: process.env.ROUTES_PREFIX + "otp" });
    fastify.register(raffleHistory, {
      prefix: process.env.ROUTES_PREFIX + "raffleHistory",
    });
    fastify.register(FileEntries, {
      prefix: process.env.ROUTES_PREFIX + "file",
    });
    fastify.register(winnerEntries, {
      prefix: process.env.ROUTES_PREFIX + "winner",
    });
    fastify.register(CronJobs, {
      prefix: process.env.ROUTES_PREFIX + "cron",
    });
    fastify.register(LogoutRoute, {
      prefix: process.env.ROUTES_PREFIX + "logout",
    });
    fastify.register(TestingRoutes, {
      prefix: process.env.ROUTES_PREFIX + "testingroutes",
    });
    fastify.register(PasswordResets, {
      prefix: process.env.ROUTES_PREFIX + "password-reset",
    });
    fastify.register(exportRoute, {
      prefix: process.env.ROUTES_PREFIX + "export",
    });
    fastify.register(alphaCode, {
      prefix: process.env.ROUTES_PREFIX + "alphacode",
    });
    fastify.register(Inquiry, {
      prefix: process.env.ROUTES_PREFIX + "inquiry",
    });
    fastify.register(FreeTickets, {
      prefix: process.env.ROUTES_PREFIX + "freetickets",
    });
    fastify.register(userType, {
      prefix: process.env.ROUTES_PREFIX + "UserType",
    });
    /**
     *error handler
     */
    fastify.setErrorHandler((err, req, res) => {
      if (
        !err.message.toLowerCase().includes("error") &&
        err.message.trim() !== "Need login!"
      ) {
        console.log(err);
        res.status(400).send({ result: "error", message: "Server Error" });
      } else if (err.code === undefined) {
        res.status(400).send({ result: "error", message: err.message });
      } else {
        if (err.code === "FST_ERR_VALIDATION") {
          res
            .status(err.statusCode)
            .send({ result: "error", message: "ErrorCode x923" });
        } else {
          res
            .status(err.statusCode)
            .send({ result: "error", message: "server Error", err });
        }
      }
    });
    // if not found return server error only
    fastify.setNotFoundHandler((request, reply) => {
      reply.status(404).send({
        error: "Error Found",
        message: `Something went wrong please contact us`,
        statusCode: 404,
      });
    });
    fastify.listen({ port: process.env.PORT }, function (err, address) {
      if (err) {
        fastify.log.error(err);
        process.exit(1);
      }
      // Server is now listening on ${address}

      fastify.log.info(` Server is now listening on ${address}`);
    });

    const connected = await conn.auth();
    if (connected) {
      await conn.auth();
      await Associations();
      await conn.sync();
      setTimeout(async () => {
        await createSuperUser();
      }, 500);
    }

    await fastify.ready();
  } catch (err) {
    console.log(err);
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
