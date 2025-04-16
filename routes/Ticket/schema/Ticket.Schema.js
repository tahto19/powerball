import {
  fetchTicketController,
  postTicketController,
  raffleDrawController,
  ticketHistoryInEntriesController,
} from "../controller/Ticket.controller.js";

export const raffleDrawSchema = {
  handler: raffleDrawController,
};
export const fetchTicketSchema = {
  handler: fetchTicketController,
  schema: {
    body: {
      type: "object",
      properties: {
        sort: { type: "array" },
        offset: { type: "number" },
        filter: { type: "array" },
        limit: { type: "number" },
      },
    },
  },
};
export const postTicketSchema = {
  handler: postTicketController,
  body: {
    type: "object",
    properties: {
      ticket_id: { type: "string" },
    },
  },
};
export const ticketHistoryInEntriesSchema = {
  handler: ticketHistoryInEntriesController,
};
