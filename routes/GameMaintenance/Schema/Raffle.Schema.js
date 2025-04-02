import { insertController } from "../Controller/Raffle.Controller.js";

export const insertSchema = {
  handler: insertController,
  body: {
    details: { type: "string" },
    more_details: { type: "string" },
    active: { type: "boolean" },
    starting_date: { type: "string" },
    end_date: { type: "string" },
    schedule_type: { type: "number" },
  },
};
