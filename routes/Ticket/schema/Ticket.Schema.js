import {
  fetchTicketController,
  postTicketController,
  raffleDrawController,
  ticketHistoryInEntriesController,
} from "../controller/Ticket.controller.js";

export const raffleDrawSchema = {
  handler: raffleDrawController,
  schema: {
    body: {
      type: "object",
      required: ["prize_id", "raffle_id"],
      properties: {
        raffle_id: { type: "number" },
        prize_id: { type: "number" },
      },
    },
  },
};
export const fetchTicketSchema = {
  handler: fetchTicketController,
  schema: {
    body: {
      type: "object",
      required: ["sort", "filter", "offset", "limit"],
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
  schema: {
    body: {
      type: "object",
      required: ["ticket_id"],
      properties: {
        ticket_id: { type: "string" },
      },
    },
  },
};
export const ticketHistoryInEntriesSchema = {
  handler: ticketHistoryInEntriesController,
};
