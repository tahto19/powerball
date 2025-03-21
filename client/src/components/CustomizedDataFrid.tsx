import * as React from 'react';
import { DataGrid, GridPaginationModel, GridSortModel, GridFilterModel, GridRowsProp, GridColDef, getGridStringOperators } from '@mui/x-data-grid';
import debounce from "lodash.debounce";

interface PaginationProps {

    page: number;
    pageSize: number;

}
interface GridProps {
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
}

export default function CustomizedDataGrid({ sx, data, headers, pagination = {
    page: 0,
    pageSize: 10,
}, pageLength = 10, onTableChange }: GridProps) {
    // Get only "contains" operator for filtering
    const containsOperator = getGridStringOperators().filter((op) => op.value === "contains");

    // Modify column headers to allow only "contains"
    const modifiedHeaders = headers.map((col) =>
        col.filterable !== false ? { ...col, filterOperators: containsOperator } : col
    );

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
            sx={sx}
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
