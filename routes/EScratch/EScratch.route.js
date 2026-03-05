import { EScratchSchema } from "./Schema/EScratch.Schema.js";

const EScratchRoute = (app, opts, done) => {
  app.post("/credits", EScratchSchema);
  done();
};
export default EScratchRoute;
