import { getDataSchema } from "./Schema/winnerEntries.Schema.js";

const winnerEntries = (app, opts, done) => {
  app.post("/getDataAll", getDataSchema);
  done();
};

export default winnerEntries;
