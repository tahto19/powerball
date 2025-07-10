import { GridColDef } from "@mui/x-data-grid";

const tableHeaders: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    flex: 1,
    minWidth: 200,
    editable: false,
  },
  {
    field: "entries",
    headerName: "Entries",
    flex: 1,
    minWidth: 200,
    editable: false,
  },
];
export default tableHeaders;
