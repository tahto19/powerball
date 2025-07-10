import {
  getAllSchema,
  getDataSchema,
  insertDataSchema,
  putDataSchema,
} from "./Schema/alphaCode.Schema.js";

const alphaCode = (app, opts, done) => {
  app.post("/insert", insertDataSchema);
  app.put("/update", putDataSchema);
  app.get("/", getAllSchema);
  app.post("/", getDataSchema);

  done();
};
export default alphaCode;
