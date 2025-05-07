//@ts-nocheck

import * as React from "react";
import {
  DataGrid,
  GridPaginationModel,
  GridSortModel,
  GridFilterModel,
  GridRowsProp,
  GridColDef,
  getGridStringOperators,
} from "@mui/x-data-grid";
import debounce from "lodash.debounce";
import Box from "@mui/material/Box";

import EditIcon from "@mui/icons-material/Edit";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

import { useAppSelector } from "@/redux/hook";

interface PaginationProps {
  page: number | null;
  pageSize: number | null;
}
interface GridProps<T> {
  sx: any;
  data: GridRowsProp | null;
  headers: GridColDef[];
  pagination: PaginationProps;
  pageLength: number | null;
  rowHeight: number;
  onTableChange?: (params: {
    page: number;
    pageSize: number;
    sortModel: GridSortModel;
    filterModel: GridFilterModel;
  }) => void;
  onEditAction: (row: T) => void | null | undefined;
  onViewAction: (row: T) => void | null | undefined;
  onDeleteAction?: (row: T) => void | null | undefined;
}

export default function CustomizedDataGrid<T>({
  sx,
  data,
  headers,
  pagination = {
    page: 0,
    pageSize: 10,
  },
  pageLength = 10,
  rowHeight = 75,
  onTableChange,
  onEditAction,
  onViewAction,
  onDeleteAction,
}: GridProps<T>) {
  const { token } = useAppSelector((state) => state.token);
  // Get only "contains" operator for filtering
  const containsOperator = getGridStringOperators().filter(
    (op) => op.value === "contains"
  );

  // Modify column headers to allow only "contains"
  let modifiedHeaders = headers.map((col) =>
    col.filterable !== false
      ? { ...col, filterOperators: containsOperator }
      : col
  );

  // Modify column to add "Actions" header
  modifiedHeaders = [
    ...modifiedHeaders,
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      width: 150,
      renderCell: (params: any) => (
        <Box
          sx={{ display: "flex", height: "100%", gap: 1, alignItems: "center" }}
        >
          {
            onEditAction ? (
              <IconButton
                aria-label="edit"
                size="small"
                onClick={(event) => {
                  event.stopPropagation(); // ✅ Prevents row click from triggering sorting/filtering
                  onEditAction(params.row);
                }}
              >
                <EditIcon
                  color="primary"
                  fontSize="inherit"
                />
              </IconButton>
            ) : null
          }

          {
            onViewAction ? (
              <IconButton
                aria-label="edit"
                size="small"
                onClick={(event) => {
                  event.stopPropagation(); // ✅ Prevents row click from triggering sorting/filtering
                  onViewAction(params.row);
                }}
              >
                <RemoveRedEyeRoundedIcon
                  color="success"
                  fontSize="inherit"
                />
              </IconButton>
            ) : null
          }
          {
            onDeleteAction ? (
              <IconButton
                aria-label="delete"
                size="small"
                onClick={(event) => {
                  event.stopPropagation();
                  onDeleteAction(params.row);
                }}
              >
                <DeleteIcon
                  color="error"
                  fontSize="inherit"
                />
              </IconButton>
            ) : null
          }


        </Box>
      ),
    },
  ];

  const [paginationModel, setPaginationModel] =
    React.useState<GridPaginationModel>(pagination);
  const [sortModel, setSortModel] = React.useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: [],
  });

  // Debounced API call
  const handleFilterChange = React.useMemo(
    () =>
      debounce((newFilterModel: GridFilterModel) => {
        setFilterModel(newFilterModel);

        // if (newFilterModel && newFilterModel.items && newFilterModel.items.length > 0 && newFilterModel.items[0].value && newFilterModel.items[0].value !== "") {
        //     setFilterModel(newFilterModel);
        // }
      }, 500), // 500ms debounce delay
    []
  );
  const prevState = React.useRef({
    token: "",
    page: null,
    pageSize: null,
    sortModel: null,
    filterModel: null,
  });

  // Handle changes and send them to parent
  React.useEffect(() => {
    if (!onTableChange) return;

    const hasChanged =
      prevState.current.token !== token ||
      prevState.current.page !== paginationModel.page ||
      prevState.current.pageSize !== paginationModel.pageSize ||
      JSON.stringify(prevState.current.sortModel) !==
      JSON.stringify(sortModel) ||
      JSON.stringify(prevState.current.filterModel) !==
      JSON.stringify(filterModel);

    if (!hasChanged) return;

    prevState.current = {
      token: token,
      page: paginationModel.page,
      pageSize: paginationModel.pageSize,
      sortModel,
      filterModel,
    };

    onTableChange({
      page: paginationModel.page,
      pageSize: paginationModel.pageSize,
      sortModel,
      filterModel,
    });
  }, [token, paginationModel, sortModel, filterModel, onTableChange]);
  return (
    <DataGrid
      sx={{
        ...sx,
        // "& .MuiDataGrid-cell": {
        //     padding: "10px", // ✅ Add padding inside cells
        // },
      }}
      rowHeight={rowHeight}
      paginationMode="server"
      sortingMode="server"
      filterMode="server"
      rows={data}
      rowCount={pageLength}
      columns={modifiedHeaders}
      getRowClassName={(params: any) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
      initialState={{
        pagination: { paginationModel: paginationModel },
        sorting: {
          sortModel: [{ field: "id", sort: "desc" }], // 👈 Default sorting
        },
      }}
      pageSizeOptions={[1, 2, 10, 20, 50]}
      disableColumnResize
      density="compact"
      slotProps={{
        filterPanel: {
          filterFormProps: {
            logicOperatorInputProps: {
              variant: "outlined",
              size: "small",
            },
            columnInputProps: {
              variant: "outlined",
              size: "small",
              sx: { mt: "auto" },
            },
            operatorInputProps: {
              variant: "outlined",
              size: "small",
              sx: { mt: "auto" },
            },
            valueInputProps: {
              InputComponentProps: {
                variant: "outlined",
                size: "small",
              },
            },
          },
        },
      }}
      onPaginationModelChange={setPaginationModel}
      onSortModelChange={setSortModel}
      onFilterModelChange={handleFilterChange}
    />
  );
}
