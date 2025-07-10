import {
  getAllController,
  getDataController,
  insertDataController,
  putDataController,
} from "../Controller/alphaCode.controller.js";

export const getDataSchema = {
  handler: getDataController,
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
export const insertDataSchema = {
  handler: insertDataController,
  schema: {
    body: {
      type: "object",
      properties: {
        name: { type: "string" },
        entries: { type: "number" },
      },
      required: ["name", "entries"],
    },
  },
};
export const putDataSchema = {
  handler: putDataController,
  schema: {
    body: {
      type: "object",
      properties: {
        name: { type: "string" },
        entries: { type: "number" },
        id: { type: "number" },
      },
      required: ["name", "entries", "id"],
    },
  },
};
export const getAllSchema = {
  handler: getAllController,
};
