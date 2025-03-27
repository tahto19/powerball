import {
  checkSessionController,
  getMyDetailsController,
  LoginController,
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
