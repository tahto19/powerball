import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";

export const columnHeader: GridColDef[] = [
  { field: 'name', headerName: 'Prize Name', flex: 1, },
  { field: 'type', headerName: 'Type', flex: 1, },
  { field: 'value', headerName: 'Amount', flex: 1, },
]

export const columnHeader2: GridColDef[] = [
  { field: "ticket_history_generate", headerName: "Ticket Code", flex: 1 },
  { field: "fullname", headerName: "Name", flex: 1, sortable: false,
          filterable: false, },
  { field: "createdAt", headerName: "Participated At", flex: 1, renderCell: (params: any) => {
        const value = params.value;
        return moment(value).format("MMMM D, YYYY h:mm A");
      }},
];

export const paginationModel = { page: 0, pageSize: 10}