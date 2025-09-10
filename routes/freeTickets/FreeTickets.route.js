import { testData } from "./Controller/FreeTickets.Controller.js";
import {
  getDataSchema,
  patchDataSchema,
  postDataSchema,
} from "./Schema/FreeTickets.Schema.js";

const FreeTickets = (app, opts, done) => {
  app.get("/", { handler: testData });
  app.post("/", getDataSchema);
  app.post("/insert", postDataSchema);
  app.put("/patch", patchDataSchema);

  done();
};
export default FreeTickets;
