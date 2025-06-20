import {
  getDataSchema,
  getOnlyTotalPerRaffleScheduleSchema,
  getWinnersTablePerScheduleSchema,
  getWinnerTableSchema,
} from "./Schema/winnerEntries.Schema.js";

const winnerEntries = (app, opts, done) => {
  app.post("/getDataAll", getDataSchema);
  app.post("/myWinners", getWinnerTableSchema);
  app.post("/getWinners", getWinnersTablePerScheduleSchema);
  app.post("/getWinnersMerge", getOnlyTotalPerRaffleScheduleSchema);
  done();
};

export default winnerEntries;
