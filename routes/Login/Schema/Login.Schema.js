import {
  checkSessionController,
  getMyDetailsController,
  LoginController,
  loginUsingMobileNumberController,
  mobileNumberController,
} from "../Controller/Login.controller.js";

export const LoginSchema = {
  handler: LoginController,
  body: {
    password: { type: "string" },
    username: { type: "string" },
  },
};
export const getMyDetailsSchema = {
  handler: getMyDetailsController,
};
export const checkSessionSchema = {
  handler: checkSessionController,
};
export const mobileNumberSchmea = {
  handler: mobileNumberController,
};
export const loginUsingMobileNumberSchema = {
  handler: loginUsingMobileNumberController,
};
