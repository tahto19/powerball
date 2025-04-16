import { insertController } from "../Controller/Raffle.Controller.js";
export const insertSchema = {
  handle: insertController,
  body: {
    type: "object",
    propterties: {
      id: { type: ["interger", "null"] },
      description: { type: "string" },
      name: { type: "string" },
      file: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            type: { type: "string" },
            size: { type: "number" },
          },
        },
      },
    },
  },
};
