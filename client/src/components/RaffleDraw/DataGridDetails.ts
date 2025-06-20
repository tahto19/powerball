import { GridColDef } from "@mui/x-data-grid";

export const columnHeader: GridColDef[] = [
  { field: "winningTicket", headerName: "Winning Ticket", flex: 1 },
  { field: "type", headerName: "Type", flex: 1 },
  { field: "value", headerName: "Amount", flex: 1 },
];

export const columnHeader2: GridColDef[] = [
  { field: "ticket_history_generate", headerName: "Ticket Code", flex: 1 },
  { field: "createdAt", headerName: "Participated At", flex: 1 },
];


export const paginationModel = { page: 0, pageSize: 10 };
