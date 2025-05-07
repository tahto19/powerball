import {
  getRaffleEntriesSchema,
  insertRaffleHistorySchema,
} from "./Schema/raffleHistory.Schema.js";

const raffleHistory = (app, opts, done) => {
  app.post("/insert", insertRaffleHistorySchema);
  app.post("/myEntries", getRaffleEntriesSchema);
  done();
};
export default raffleHistory;
