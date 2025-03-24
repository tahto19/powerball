import * as React from 'react';
import { DataGrid, GridPaginationModel, GridSortModel, GridFilterModel, GridRowsProp, GridColDef, getGridStringOperators } from '@mui/x-data-grid';
import debounce from "lodash.debounce";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import EditIcon from '@mui/icons-material/Edit';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
interface PaginationProps {

    page: number;
    pageSize: number;

}
interface GridProps<T> {
    sx: any;
    data: GridRowsProp;
    headers: GridColDef[];
    pagination: PaginationProps;
    pageLength: number;
    onTableChange?: (params: {
        page: number;
        pageSize: number;
        sortModel: GridSortModel;
        filterModel: GridFilterModel;
    }) => void;
    onEditAction: (row: T) => void;
    onViewAction: (row: T) => void;
    onDeleteAction: (row: T) => void;
}



export default function CustomizedDataGrid<T>({ sx, data, headers, pagination = {
    page: 0,
    pageSize: 10,
}, pageLength = 10, onTableChange, onEditAction, onViewAction, onDeleteAction }: GridProps<T>) {
    // Get only "contains" operator for filtering
    const containsOperator = getGridStringOperators().filter((op) => op.value === "contains");

    // Modify column headers to allow only "contains"
    let modifiedHeaders = headers.map((col) =>
        col.filterable !== false ? { ...col, filterOperators: containsOperator } : col
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
                <Box sx={{ display: "flex", height: "100%", gap: 1, alignItems: 'center' }}>
                    <IconButton
                        aria-label="edit" size="small"
                        onClick={(event) => {
                            event.stopPropagation(); // ✅ Prevents row click from triggering sorting/filtering
                            onEditAction(params.row)
                        }
                        }
                    >
                        <EditIcon color="primary" fontSize="inherit" />
                    </IconButton>
                    <IconButton
                        aria-label="edit" size="small"
                        onClick={(event) => {
                            event.stopPropagation(); // ✅ Prevents row click from triggering sorting/filtering
                            onViewAction(params.row)
                        }
                        }
                    >
                        <RemoveRedEyeRoundedIcon color="success" fontSize="inherit" />
                    </IconButton>
                    <IconButton
                        aria-label="delete" size="small"
                        onClick={(event) => {
                            event.stopPropagation();
                            onDeleteAction(params.row)
                        }}
                    >
                        <DeleteIcon color="error" fontSize="inherit" />
                    </IconButton>
                </Box>
            ),
        },
    ];


    const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>(pagination);
    const [sortModel, setSortModel] = React.useState<GridSortModel>([]);
    const [filterModel, setFilterModel] = React.useState<GridFilterModel>({ items: [] });

    // Debounced API call
    const handleFilterChange = React.useMemo(
        () =>
            debounce((newFilterModel: GridFilterModel) => {
                if (newFilterModel && newFilterModel.items && newFilterModel.items[0].value && newFilterModel.items[0].value !== "") {
                    setFilterModel(newFilterModel);
                }
            }, 500), // 500ms debounce delay
        []
    );

    // Handle changes and send them to parent
    React.useEffect(() => {
        if (onTableChange) {
            onTableChange({
                page: paginationModel.page,
                pageSize: paginationModel.pageSize,
                sortModel,
                filterModel,
            });
        }
    }, [paginationModel, sortModel, filterModel, onTableChange]);
    return (
        <DataGrid
            sx={{
                ...sx,
                // "& .MuiDataGrid-cell": {
                //     padding: "10px", // ✅ Add padding inside cells
                // },
            }}
            rowHeight={75}
            paginationMode="server"
            sortingMode="server"
            filterMode="server"
            rows={data}
            rowCount={pageLength}
            columns={modifiedHeaders}
            getRowClassName={(params: any) =>
                params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
            initialState={{
                pagination: { paginationModel: paginationModel },
            }}
            pageSizeOptions={[1, 2, 10, 20, 50]}
            disableColumnResize
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
            onPaginationModelChange={setPaginationModel}
            onSortModelChange={setSortModel}
            onFilterModelChange={handleFilterChange}
        />
    );
}
