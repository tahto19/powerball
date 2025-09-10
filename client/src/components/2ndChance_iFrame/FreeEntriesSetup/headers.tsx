import { Edit, Visibility } from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import moment from "moment";

export const headers = (
  onClickHandleView?: (row: any) => void,
  onClickHandleEdit?: (row: any) => void
): GridColDef[] => [
  {
    field: "date_range",
    headerName: "Free Entry Dates",
    flex: 1,
    minWidth: 200,
    renderCell: (params: GridRenderCellParams<Date>) => {
      // const dateRange = JSON.parse(params.value);
      console.log(params.value);
      return (
        <>
          ss
          {/* {moment(dateRange[0]).format("MMMM DD yyyy, hh:mm a")} -{" "}
          {moment(dateRange[1]).format("MMMM DD yyyy, hh:mm a")} */}
        </>
      );
    },
  },
  {
    field: "value",
    headerName: "Value",
    flex: 1,
    minWidth: 200,
    renderCell: (params: GridRenderCellParams<any, Date>) => {
      return <>{params.value}</>;
    },
  },
  {
    field: "createdAt",
    headerName: "Date Created",
    flex: 1,
    minWidth: 200,
    renderCell: (params: GridRenderCellParams<any, Date>) => {
      return <>{moment(params.value).format("MMMM DD yyyy, hh:mm a")}</>;
    },
  },
  {
    field: "fullname",
    headerName: "Created By",
    flex: 1,
    minWidth: 200,
    renderCell: (params: GridRenderCellParams<any, Date>) => {
      return <>{params.value}</>;
    },
  },
  {
    field: "Actions",
    headerName: "Action",
    flex: 1,
    minWidth: 200,
    renderCell: (params: GridRenderCellParams<any, Date>) => {
      return (
        <Stack
          direction="row"
          spacing={1}
        >
          <IconButton
            sx={{ border: "none" }}
            onClick={() => {
              if (onClickHandleEdit) onClickHandleEdit(params.row);
            }}
          >
            <Edit
              color="primary"
              fontSize="small"
            />
          </IconButton>
          <IconButton
            sx={{ border: "none" }}
            onClick={() => {
              if (onClickHandleView) onClickHandleView(params.row);
            }}
          >
            <Visibility
              color="success"
              fontSize="small"
            />
          </IconButton>
        </Stack>
      );
    },
  },
];
