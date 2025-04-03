import {
  insertSchema,
  getSchema,
  getSchemaAll,
  updateSchema,
} from "./Schema/Raffle.Schema.js";

const raffle = (app, opts, done) => {
  app.post("/create", insertSchema);
  app.post("/", getSchema);
  app.post("/all", getSchemaAll);
  app.put("/", updateSchema);
  done();
};
export default raffle;
