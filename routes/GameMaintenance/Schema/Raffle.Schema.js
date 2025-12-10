import fastifyCaching from "@fastify/caching";
import {
  insertController,
  getController,
  getControllerAll,
  updateController,
  get2ndChanceControllerAll,
  getRaffleDetails,
  getControllerV2,
  getRaffleDrawListController,
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

export const getRafflesDetailsSchema = {
  handler: getControllerV2,
  body: getBodySchema,
};

export const getRaffleDetailsSchema = {
  handler: getRaffleDetails,
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
  bodyLimit: 100 * 1024 * 1024, // 100 MB
};

export const get2ndChanceSchemaAll = {
  handler: get2ndChanceControllerAll,
  body: getBodySchema,
};

export const getRaffleDrawListSchema = {
  handler: getRaffleDrawListController,
  body: getBodySchema,
};
