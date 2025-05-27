import {
  dailyRaffleSchema,
  checkActiveRafflesSchema,
} from "./Schema/Cron.Schema.js";
const cron = (app, opts, done) => {
  app.get("/createDailyRaffle", dailyRaffleSchema);
  app.get("/checkActiveRaffles", checkActiveRafflesSchema);

  done();
};

export default cron;
