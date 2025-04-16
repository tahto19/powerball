import { insertSchema } from "./Schema/User.Schema.js";
const image = (app, opts, done) => {
  app.post("/insert", insertSchema);
};

export default image;
