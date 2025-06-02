import {
  createOTPController,
  verifyCodeController,
} from "../Controller/OTP.controller.js";

export const createOTPSchema = {
  handler: createOTPController,
  schema: {
    body: {
      type: "object",
      required: ["emailAddress"],
      properties: {
        emailAddress: { type: "string" },
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
