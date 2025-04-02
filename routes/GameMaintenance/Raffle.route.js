import { insertSchema } from "./Schema/Raffle.Schema.js";

const raffle = (app, opts, done) => {
  app.post("/", insertSchema);

  done();
};
export default raffle;
