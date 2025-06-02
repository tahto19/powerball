import { emailSchema } from "./Schema/TestngRoutes.Schema.js";

const TestingRoutes = (app, opts, done) => {
  app.post("/senderEmail", emailSchema);
  done();
};
export default TestingRoutes;
