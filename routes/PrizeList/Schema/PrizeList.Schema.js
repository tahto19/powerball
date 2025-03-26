import { insertController } from "../Controller/PrizeList.Controller.js";

export const insertSchema = {
  handler: insertController,
  body: {
    value: { type: "number" },
    name: { type: "string" },
    type: { type: "string" },
  },
};
