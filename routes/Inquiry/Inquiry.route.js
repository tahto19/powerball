import { InquirySchema } from "./Schema/Inquiry.Schema.js";

const InquiryRoute = (app, opts, done) => {
  app.post("/send", InquirySchema);
  done();
};
export default InquiryRoute;
