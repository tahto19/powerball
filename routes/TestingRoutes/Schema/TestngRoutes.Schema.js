import { EmailController } from "../Controller/TestingRoutes.controller.js";

export const emailSchema = {
  handler: EmailController,
  schema: {
    body: {
      type: "object",
      required: ["data"],
      properties: {
        data: {
          type: "object",
          required: ["from"],
          properties: {
            from: { type: "string" },
            to: { type: "string" },
            subject: { type: "string" },
            text: { type: "string" },
            html: { type: "string" },
          },
        },
      },
    },
  },
};
