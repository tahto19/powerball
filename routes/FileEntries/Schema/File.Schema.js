import {
  insertImageController,
  updateImageController,
  getController,
  serveImageController,
  serveVideoController,
  serveValidIDController,
} from "../Controller/File.Controller.js";
export const insertImageSchema = {
  handler: insertImageController,
  // body: {
  //   type: "object",
  //   propterties: {
  //     id: { type: ["interger", "null"] },
  //     description: { type: "string" },
  //     name: { type: "string" },
  //     file: {
  //       type: "array",
  //       items: {
  //         type: "object",
  //         properties: {
  //           name: { type: "string" },
  //           type: { type: "string" },
  //           size: { type: "number" },
  //         },
  //       },
  //     },
  //   },
  // },
};
export const updateImageSchema = {
  handler: updateImageController,
};

export const getSchema = {
  handler: getController,
};

export const serveImageSchema = {
  handler: serveImageController,
  onSend: async (req, reply, payload) => {
    return payload; // Just return the payload untouched
  },
};

export const serveVideoSchema = {
  handler: serveVideoController,
};

export const serveValidIDSchema = {
  handler: serveValidIDController,
};
