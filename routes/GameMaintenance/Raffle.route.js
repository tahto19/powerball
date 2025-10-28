import {
  insertSchema,
  getSchema,
  getSchemaAll,
  updateSchema,
  get2ndChanceSchemaAll,
  getRaffleDetailsSchema,
  getRafflesDetailsSchema,
  getRaffleDrawListSchema,
} from "./Schema/Raffle.Schema.js";

const raffle = (app, opts, done) => {
  app.post("/create", insertSchema);
  // app.post("/", getSchema);
  app.post("/", getSchema);
  app.post("/raffles", getRafflesDetailsSchema);
  app.post("/raffle-details", getRaffleDetailsSchema);
  app.post("/all", getSchemaAll);
  app.put("/", updateSchema);
  app.post("/2nd-chance/list", get2ndChanceSchemaAll);
  app.post("/raffle-draws-list", getRaffleDrawListSchema);
  done();
};
export default raffle;
