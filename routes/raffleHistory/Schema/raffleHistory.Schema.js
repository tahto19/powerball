import {
  getRaffleEntriesController,
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
export const getRaffleEntriesSchema = {
  handler: getRaffleEntriesController,
  body: {
    type: "object",
    properties: {
      filter: { type: "array" },
      offset: { type: "number" },
      limit: { type: "number" },
      sort: { type: "array" },
    },
  },
};
