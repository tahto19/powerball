import {
  insertController,
  getController,
  getControllerAll,
  updateController,
} from "../Controller/Raffle.Controller.js";

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

const getBodySchema = {
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
  filter: {
    type: "array",
    items: {
      type: "object",
      properties: {
        type: { type: "string" },
        field: { type: "string" },
        filter: { type: "string" },
      },
      // additionalProperties: {type: "string"}
    },
  },
};

export const getSchema = {
  handler: getController,
  body: getBodySchema,
};

export const getSchemaAll = {
  handler: getControllerAll,
  body: getBodySchema,
};

export const updateSchema = {
  handler: updateController,
  body: {
    id: { type: "number" },
    details: { type: "string" },
    more_details: { type: "string" },
    active: { type: "boolean" },
    starting_date: { type: "string" },
    end_date: { type: "string" },
    schedule_type: { type: "number" },
  },
};
