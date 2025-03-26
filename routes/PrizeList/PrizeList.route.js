import { insertSchema } from "./Schema/PrizeList.Schema.js";

const prizeList = (app, opts, done) => {
  app.post("/", insertSchema);

  done();
};
export default prizeList;
