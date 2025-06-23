import { exportDataSchema } from "./Schema/Export.Schema.js";

export const exportRoute = (app, opts, done) => {
  app.post("/", exportDataSchema);
  done();
};
