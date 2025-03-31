import {
  insertSchema,
  getSchema,
  updateSchema,
} from "./Schema/PrizeList.Schema.js";

const prizeList = (app, opts, done) => {
  app.post("/", insertSchema);
  app.get("/", getSchema);
  app.put("/", updateSchema);

  done();
};
export default prizeList;
