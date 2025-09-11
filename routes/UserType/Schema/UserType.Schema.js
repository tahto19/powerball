import {
  getUserTypeByUserController,
  patchDataController,
} from "../Controller/UserType.controller.js";

export const getUserTypeByUserSchema = {
  handler: getUserTypeByUserController,
  schema: {
    querystring: {
      type: "object",
      properties: {
        id: { type: "string" },
      },
    },
  },
};
export const updateUserTypeSchema = {
  handler: patchDataController,
  // schema: {
  //   body: {
  //     type: "object",
  //     properties: {
  //       id: { type: "number" },
  //       permissions: { type: "object" },
  //     },
  //   },
  // },
};
