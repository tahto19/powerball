import {
  createUser,
  getController,
  insertController,
  updateController,
  getUserController,
} from "../Controller/User.Controller.js";

export const getSchema = {
  handler: getController,
  params: {
    limit: { type: "number" },
    offset: { type: "number" },
    // filter: { type: "array" },
  },
};
export const insertSchema = {
  handler: insertController,
  body: {
    firstname: { type: "string" },
    lastname: { type: "string" },
    password: { type: "string" },
    emailAddres: { type: "string" },
    mobileNumber: { type: "string" },
  },
};
export const updateSchema = {
  handler: updateController,
  schema: {
    body: {
      type: "object",
      properties: {
        firstname: { type: "string" },
        lastname: { type: "string" },
        password: { type: "string" },
        emailAddres: { type: "string" },
        mobileNumber: { type: "string" },
        id: { type: "string" },
        isAdmin: { type: "string" },
        city: { type: "string" },
        provinc: { type: "string" },
        baranga: { type: "string" },
        hbnandstr: { type: "string" },
        gender: { type: "string" },
      },
    },
  },
};
export const createUserSchema = {
  handler: createUser,
  body: {
    firstname: { type: "string" },
    lastname: { type: "string" },
    password: { type: "string" },
    emailAddres: { type: "string" },
    mobileNumber: { type: "string" },
    id: { type: "string" },
  },
};

export const getUserSchema = {
  handler: getUserController,
  body: {
    firstname: { type: "string" },
    lastname: { type: "string" },
    password: { type: "string" },
    emailAddres: { type: "string" },
    mobileNumber: { type: "string" },
    id: { type: "string" },
  },
};
