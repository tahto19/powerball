import { dailyRaffleSchema } from "./Schema/Cron.Schema.js";
const cron = (app, opts, done) => {
  app.get("/createDailyRaffle", dailyRaffleSchema);

  done();
};

export default cron;
