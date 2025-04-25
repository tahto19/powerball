import {
  insertImageSchema,
  updateImageSchema,
  getSchema,
  serveImageSchema,
} from "./Schema/File.Schema.js";
const file = (app, opts, done) => {
  app.post("/image", insertImageSchema);
  app.put("/image", updateImageSchema);
  app.post("/", getSchema);
  app.get("/serve/image/:id", serveImageSchema);
  done();
};

export default file;
