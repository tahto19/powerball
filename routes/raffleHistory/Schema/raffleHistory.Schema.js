import fastifyCaching from "@fastify/caching";
import {
  getRaffleEntriesController,
  getRaffleEntriesInScheduleController,
  getRaffleHistoryController,
  insertRaffleHistoryController,
} from "../Controller/raffleHistory.Controller.js";

export const insertRaffleHistorySchema = {
  handler: insertRaffleHistoryController,
  schema: {
    body: {
      type: "object",
      properties: {
        raffle_id: { type: "number" },
        entries: { type: "number" },
      },
      // required: ["raffle_id", "entries"],
    },
  },
};
export const getRaffleHistorySchema = {
  handler: getRaffleHistoryController,
  schema: {
    body: {
      type: "object",
      properties: {
        raffle_id: { type: "number" },
        user_id: { type: "number" },
      },
      required: ["raffle_id"],
    },
  },
};
export const getRaffleEntriesSchema = {
  handler: getRaffleEntriesController,
  schema: {
    body: {
      type: "object",
      properties: {
        filter: { type: "array" },
        offset: { type: "number" },
        limit: { type: "number" },
        sort: { type: "array" },
      },
    },
  },
};
export const getRaffleEntriesInScheduleSchema = {
  handler: getRaffleEntriesInScheduleController,
  schema: {
    body: {
      type: "object",
      properties: {
        id: { type: "number" },
        offset: { type: "number" },
        limit: { type: "number" },
        sort: { type: "array" },
        filter: {
          type: "array",
        },
      },
      required: ["offset", "limit", "sort", "filter"],
    },
  },
};
