import {
  insertSchema,
  getSchema,
  getSchemaAll,
  updateSchema,
} from "./Schema/PrizeList.Schema.js";

const prizeList = (app, opts, done) => {
  app.post("/create", insertSchema);
  app.post("/", getSchema);
  app.post("/all", getSchemaAll);
  app.put("/", updateSchema);

  done();
};
export default prizeList;
