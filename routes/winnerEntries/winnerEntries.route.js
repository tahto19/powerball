import {
  getDataSchema,
  getWinnerTableSchema,
} from "./Schema/winnerEntries.Schema.js";

const winnerEntries = (app, opts, done) => {
  app.post("/getDataAll", getDataSchema);
  app.post("/myWinners", getWinnerTableSchema);
  done();
};

export default winnerEntries;
