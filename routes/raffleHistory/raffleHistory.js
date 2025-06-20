import {
  getRaffleEntriesInScheduleSchema,
  getRaffleEntriesSchema,
  insertRaffleHistorySchema,
} from "./Schema/raffleHistory.Schema.js";

const raffleHistory = (app, opts, done) => {
  app.post("/insert", insertRaffleHistorySchema);
  app.post("/myEntries", getRaffleEntriesSchema);
  app.post("/getRaffleEntries", getRaffleEntriesInScheduleSchema);
  done();
};
export default raffleHistory;
