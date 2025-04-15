import {
  insertSchema,
  getSchema,
  getSchemaAll,
  updateSchema,
  get2ndChanceSchemaAll,
} from "./Schema/Raffle.Schema.js";

const raffle = (app, opts, done) => {
  app.post("/create", insertSchema);
  app.post("/", getSchema);
  app.post("/all", getSchemaAll);
  app.put("/", updateSchema);
  app.post("/2nd-chance/list", get2ndChanceSchemaAll);
  done();
};
export default raffle;
