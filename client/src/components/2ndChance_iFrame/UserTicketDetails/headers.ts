import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import moment from "moment";

const headers: GridColDef[] = [
  {
    field: "Ticket Number",
    headerName: "Ticket Number",
    flex: 1,
    minWidth: 200,
    editable: true,
    renderCell: (params: GridRenderCellParams<any, Date>) => {
      return `${moment(params.value).format("MMMM DD yyyy hh:mm A")}`;
    },
  },
  {
    field: "entries",
    headerName: "Entries",
    flex: 1,
    minWidth: 200,
    editable: true,
  },
  {
    field: "entries_used",
    headerName: "Entries Used",
    flex: 1,
    minWidth: 200,
    editable: true,
  },
  {
    field: "createdAt",
    headerName: "Created",
    flex: 1,
    minWidth: 200,
    renderCell: (params: GridRenderCellParams<any, Date>) => {
      return `${moment(params.value).format("MMMM DD yyyy hh:mm A")}`;
    },
  },
];
export default headers;
