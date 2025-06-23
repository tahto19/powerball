import { exportDataController } from "../Controller/Export.Controller.js";

export const exportDataSchema = {
  handler: exportDataController,
  schema: {
    body: {
      type: "object",
      properties: {
        type: { type: ["number", "string"] },
        date_range: { type: "array" },
      },
      required: ["type"],
    },
  },
};
