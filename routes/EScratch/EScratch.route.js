import { EScratchSchema } from "./Schema/EScratch.Schema.js";

const EScratchRoute = (app, opts, done) => {
  app.post("/", EScratchSchema);
  done();
};
export default EScratchRoute;
