import {
  getDataController,
  getOnlyTotalPerRaffleScheduleController,
  getWinnersTableController,
  getWinnersTablePerScheduleController,
} from "../controller/winnerEntries.controller.js";

export const getDataSchema = {
  handler: getDataController,
  schema: {
    body: {
      type: "object",
      // required: ["raffle_schedule_id"],
      properties: {
        raffle_schedule_id: { type: "number" },
      },
    },
  },
};
export const getWinnerTableSchema = {
  handler: getWinnersTableController,
  schema: {
    body: {
      type: "object",
      properties: {
        offset: { type: "number" },
        limit: { type: "number" },
        sort: { type: "array" },
        filter: { type: "array" },
      },
    },
  },
};
export const getWinnersTablePerScheduleSchema = {
  handler: getWinnersTablePerScheduleController,
  schema: {
    body: {
      type: "object",
      properties: {
        offset: { type: "number" },
        limit: { type: "number" },
        sort: { type: "array" },
        filter: { type: "array" },
      },
    },
  },
};
export const getOnlyTotalPerRaffleScheduleSchema = {
  handler: getOnlyTotalPerRaffleScheduleController,
  schema: {
    body: {
      type: "object",
      properties: {
        id: { type: "number" },
      },
      required: ["id"],
    },
  },
};
