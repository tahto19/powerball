import {
  detailedTicketDetailsHistorySchema,
  fetchTicketSchema,
  postTicketSchema,
  raffleDrawSchema,
  raffleDrawV2Schema,
  ticketHistoryInEntriesSchema,
} from "./schema/Ticket.Schema.js";

const Ticket = (app, opts, done) => {
  app.post("/draw", raffleDrawSchema);
  app.post("/drawV2", raffleDrawV2Schema);
  app.post("/user", fetchTicketSchema);
  app.post("/admin", fetchTicketSchema);
  app.post("/", postTicketSchema);
  app.get("/entries", ticketHistoryInEntriesSchema);
  app.get("/myEntries", ticketHistoryInEntriesSchema);
  app.post("/myTicketDetails", detailedTicketDetailsHistorySchema);
  app.post("/allTicketDetails", detailedTicketDetailsHistorySchema);
  done();
};
export default Ticket;
