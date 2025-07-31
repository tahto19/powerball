import { Checkbox } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

const tableHeaders = (onCheckboxClick: (row: any) => void): GridColDef[] => [
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
  {
    field: "active",
    headerName: "Active",
    flex: 1,
    minWidth: 200,
    editable: false,
    renderCell: (params: GridRenderCellParams<any>) => {
      return (
        <Checkbox
          checked={params.value}
          onClick={() => {
            // alert("here");
            onCheckboxClick(params.row);
          }}
        />
      );
    },
  },
];
export default tableHeaders;
