import { insertSchema, getSchema } from "./Schema/PrizeList.Schema.js";

const prizeList = (app, opts, done) => {
  app.post("/", insertSchema);
  app.get("/", getSchema);

  done();
};
export default prizeList;
