import {
  insertController,
  getController,
} from "../Controller/PrizeList.Controller.js";

export const insertSchema = {
  handler: insertController,
  body: {
    value: { type: "number" },
    name: { type: "string" },
    type: { type: "string" },
  },
};

export const getSchema = {
  handler: getController,
  body: {
    limit: { type: "number" },
    offset: { type: "number" },
    sort: {
      type: "array",
      items: {
        type: "array",
        items: [{ type: "string" }, { type: "string" }],
        minItems: 2,
        maxItems: 2,
      },
    },
  },
};
