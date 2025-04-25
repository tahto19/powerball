import { GridColDef } from "@mui/x-data-grid";

export const columnHeader: GridColDef[] = [
  { field: 'name', headerName: 'Winning Ticket', flex: 1, },
  { field: 'type', headerName: 'Type', flex: 1, },
  { field: 'value', headerName: 'Amount', flex: 1, },
]

export const paginationModel = { page: 0, pageSize: 10}