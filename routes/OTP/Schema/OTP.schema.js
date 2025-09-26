import {
  createOTPController,
  createOTPForPasswordController,
  verifyCodeController,
} from "../Controller/OTP.controller.js";

export const createOTPSchema = {
  handler: createOTPController,
  schema: {
    body: {
      type: "object",

      properties: {
        emailAddress: { type: "string" },
        mobileNumber: { type: "string" },
      },
    },
  },
};
export const verifyCodeSchema = {
  handler: verifyCodeController,
  schema: {
    body: {
      type: "object",
      required: ["id", "code"],
      properties: {
        id: { type: "number" },
        code: { type: "number" },
      },
    },
  },
};

export const createOTPForPasswordSchema = {
  handler: createOTPForPasswordController,
};
