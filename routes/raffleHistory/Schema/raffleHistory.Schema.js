import {
  getRaffleHistoryController,
  insertRaffleHistoryController,
} from "../Controller/raffleHistory.Controller.js";

export const insertRaffleHistorySchema = {
  handler: insertRaffleHistoryController,
  body: {
    type: "object",
    properties: {
      raffle_id: { type: "number" },
      entries: { type: "number" },
    },
    required: ["raffle_id", "entries"],
  },
};
export const getRaffleHistorySchema = {
  handler: getRaffleHistoryController,
  body: {
    type: "object",
    properties: {
      raffle_id: { type: "number" },
      user_id: { type: "number" },
    },
    required: ["raffle_id"],
  },
};
