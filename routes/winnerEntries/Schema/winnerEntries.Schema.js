import { getDataController } from "../controller/winnerEntries.controller.js";

export const getDataSchema = {
  handler: getDataController,
  schema: {
    body: {
      type: "object",
      properties: {
        raffle_schedule_id: { type: "number" },
      },
    },
  },
};
