import {
  getDataController,
  patchDataController,
  postDataController,
} from "../Controller/FreeTickets.Controller.js";

export const getDataSchema = {
  handler: getDataController,
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

export const postDataSchema = {
  handler: postDataController,
  schema: {
    body: {
      type: "object",
      properties: {
        startDate: {
          type: "string",
        },
        endDate: { type: "string" },
        fixed: {
          type: "boolean",
        },
        value: {
          type: "number",
        },
      },
    },
  },
};
export const patchDataSchema = {
  handler: patchDataController,
  schema: {
    body: {
      type: "object",
      properties: {
        startDate: {
          type: "string",
        },
        endDate: { type: "string" },
        fixed: {
          type: "boolean",
        },
        value: {
          type: "number",
        },
        id: {
          type: "number",
        },
      },
      required: ["id"],
    },
  },
};
