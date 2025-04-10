
import { useState, useEffect, useRef, useMemo } from 'react';
import { DataGrid, GridPaginationModel, GridRowsProp, GridColDef, getGridStringOperators } from '@mui/x-data-grid';


interface PaginationProps {

    page: number;
    pageSize: number;

}
interface GridProps<T> {
    sx: any;
    data: GridRowsProp;
    headers: GridColDef[];
    pagination: PaginationProps;
    checkboxSelection: boolean;
    onRowSelection?: ([]) => void;
}



export default function CustomizedDataGridBasic<T>({ sx, data, headers, pagination = {
    page: 0,
    pageSize: 10,
}, checkboxSelection = false, selectedModel, onRowSelection }: GridProps<T>) {
    // Get only "contains" operator for filtering
    const containsOperator = getGridStringOperators().filter((op) => op.value === "contains");

    // Modify column headers to allow only "contains"
    let modifiedHeaders = headers.map((col) =>
        col.filterable !== false ? { ...col, filterOperators: containsOperator } : col
    );


    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>(pagination);
    const [selectionModel, setSelectionModel] = useState([/* pre-selected row IDs here */]);
    const handleRowSelection = (array: []) => {
        onRowSelection(array)
        setSelectionModel(array);
    }
    useEffect(() => {
        // Example: Auto-select rows with IDs 1 and 2 when the table loads
        setSelectionModel(selectedModel);
    }, [selectedModel]);
    return (
        <DataGrid
            sx={{
                ...sx,
                // "& .MuiDataGrid-cell": {
                //     padding: "10px", // ✅ Add padding inside cells
                // },
            }}
            rowHeight={75}
            rows={data}
            rowSelectionModel={selectionModel}
            columns={modifiedHeaders}
            getRowClassName={(params: any) =>
                params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
            initialState={{
                pagination: { paginationModel: paginationModel },
                sorting: {
                    sortModel: [{ field: "id", sort: "desc" }] // 👈 Default sorting
                },
            }}
            pageSizeOptions={[1, 2, 10, 20, 50]}
            disableColumnResize
            checkboxSelection={checkboxSelection}
            density="compact"
            slotProps={{
                filterPanel: {
                    filterFormProps: {
                        logicOperatorInputProps: {
                            variant: 'outlined',
                            size: 'small',
                        },
                        columnInputProps: {
                            variant: 'outlined',
                            size: 'small',
                            sx: { mt: 'auto' },
                        },
                        operatorInputProps: {
                            variant: 'outlined',
                            size: 'small',
                            sx: { mt: 'auto' },
                        },
                        valueInputProps: {
                            InputComponentProps: {
                                variant: 'outlined',
                                size: 'small',
                            },
                        },
                    },
                },
            }}
            onRowSelectionModelChange={(newSelection) => handleRowSelection(newSelection)}
        />
    );
}
