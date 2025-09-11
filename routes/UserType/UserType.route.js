import {
  getUserTypeByUserSchema,
  updateUserTypeSchema,
} from "./Schema/UserType.Schema.js";

const userType = (app, opts, done) => {
  app.put("/", updateUserTypeSchema);
  app.get("/byUser", getUserTypeByUserSchema);
  done();
};
export default userType;
