import { insertRaffleHistorySchema } from "./Schema/raffleHistory.Schema.js";

const raffleHistory = (app, opts, done) => {
  app.post("/insert", insertRaffleHistorySchema);
  done();
};
export default raffleHistory;
