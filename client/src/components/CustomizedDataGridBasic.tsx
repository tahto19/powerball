//@ts-nocheck
import { useState, useEffect, useRef, useMemo } from "react";
import {
  DataGrid,
  GridPaginationModel,
  GridRowsProp,
  GridColDef,
  getGridStringOperators,
} from "@mui/x-data-grid";

interface PaginationProps {
  page: number;
  pageSize: number;
}
interface GridProps<T> {
  sx: any;
  data: GridRowsProp | null;
  headers: GridColDef[];
  pagination: PaginationProps;
  checkboxSelection: boolean;
  restrictDuplicate?: string;
  onRowSelection?: ([]) => void;
}

export default function CustomizedDataGridBasic<T>({
  sx,
  data,
  headers,
  pagination = {
    page: 0,
    pageSize: 10,
  },
  checkboxSelection = false,
  selectedModel,
  loading = false,
  restrictDuplicate = "",
  onRowSelection,
}: GridProps<T>) {
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

  const [paginationModel, setPaginationModel] =
    useState<GridPaginationModel>(pagination);
  const [selectionModel, setSelectionModel] = useState([
    /* pre-selected row IDs here */
  ]);
  const handleRowSelection = (array: []) => {
    if (restrictDuplicate.trim() !== "") {
      const column = restrictDuplicate;
      const newArr = [...array]
      const selectedRows = data.filter((row) => newArr.map(x => x.id).includes(row.id));
      const types = selectedRows.map((row) => row[column]);

      const hasDuplicateStatus = types.length !== new Set(types).size;
      if (hasDuplicateStatus) return onRowSelection("duplicate"); // stop update
    }

    if (onRowSelection) onRowSelection(array);
    setSelectionModel(array);
  };
  useEffect(() => {

    // Example: Auto-select rows with IDs 1 and 2 when the table loads
    if (selectedModel) {
      setSelectionModel(selectedModel.map(x => x.id || x));

    }

  }, [selectedModel]);
  return (
    <DataGrid
      sx={{
        ...sx,
        // "& .MuiDataGrid-cell": {
        //     padding: "10px", // ✅ Add padding inside cells
        // },
        fontFamily: '"Outfit Variable", sans-serif !important',
      }}
      rowHeight={75}
      rows={data}
      rowSelectionModel={selectionModel}
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
      checkboxSelection={checkboxSelection}
      density="compact"
      loadin={loading}
      slotProps={{
        loadingOverlay: {
          variant: "skeleton",
          noRowsVariant: "skeleton",
        },
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
      onRowSelectionModelChange={(newSelection) => {
        // return handleRowSelection(newSelection)
        // Get selected row IDs
        const selectedIds = newSelection;
        // Find the full row details by filtering `data` based on selected IDs
        const selectedRows = data.filter((row) =>
          selectedIds.includes(row.id)
        );

        // Pass or use the selected rows as needed
        return handleRowSelection(selectedRows);

      }
      }
    />
  );
}
