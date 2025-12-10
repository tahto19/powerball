import "dotenv/config";
import Associations from "./models/association/index.js";
import cron from "node-cron";

import conn from "./dbConnections/conn.js";

import { autoActiveRaffleController } from "./routes/CronJobs/Controller/Cron.Controller.js";
const start = async () => {
  try {
    const connected = await conn.auth();

    if (connected) {
      await conn.auth();
      await Associations();
      // await conn.sync();

      // Run every day at midnight
      cron.schedule("0 0 * * *", async () => {
        console.log("Running daily task...");
        await autoActiveRaffleController();
      });
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();
