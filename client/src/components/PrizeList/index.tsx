import * as React from "react";

import CustomizedDataGrid from "../CustomizedDataFrid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from '@mui/material/Grid2';
import apiService from "@/services/apiService";

import MyDialog from "./Dialog.tsx";
import { PrizeState, PrizePaginationState } from '@/components/PrizeList/interface';
import { bodyDecrypt } from "@/utils/util";


//Temporary data
const sampleData = [{
    id: 1,
    name: 'Prize 1',
    value: 100,
    type: "grand",

},
{
    id: 2,
    name: 'Prize 1',
    value: 100,
    type: "grand",


}]
//Temporary data
const sampleHeaders = [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 200 },
    { field: 'value', headerName: 'Value', flex: 1, minWidth: 200 },
    { field: 'type', headerName: 'Type', flex: 1, minWidth: 200 }
]
//Temporary data
const samplePagination = { page: 0, pageSize: 1 }


const defaultData = {
    id: null,
    name: "",
    value: 0,
    type: ""
}

const PrizeList = () => {
    const [dialogType, setDialogType] = React.useState("Add")
    const [data_row, setDataRow] = React.useState<PrizeState>(defaultData);

    const [list, setPrizeList] = React.useState<[]>([]);
    const [listCount, setListCount] = React.useState<number>(0);
    const [pagination, setPagination] = React.useState(samplePagination);

    const handleTableChange = async ({ page, pageSize, sortModel, filterModel }: any) => {
        console.log("Table Changed:", { page, pageSize, sortModel, filterModel });

        setPagination({ page, pageSize })

        const sort = [];
        if (sortModel.length > 0) {
            sort.push([sortModel[0].field, sortModel[0].sort.toUpperCase()]);
        }

        const query: PrizePaginationState = {
            offset: page, limit: pageSize, sort: JSON.stringify(sort)
        }

        const res = await apiService.getPrizeList(query);
        const d = bodyDecrypt(res.data.data)
        if (d && d.success === 'success') {
            console.log(d)
            setPrizeList(d.data.list)
            setListCount(d.data.total)
        }
    };

    const [open, setOpen] = React.useState(false);
    const handleOnClose = (value: boolean) => {
        setOpen(value)
    }
    const handleOpenDialog = () => {
        setDialogType("Add");
        setDataRow(defaultData)
        setOpen(true)
    }

    const handleEditAction = (row: PrizeState) => {
        setDialogType("Edit");
        setDataRow(row)
        setOpen(true)
    }

    const handleViewAction = (row: PrizeState) => {
        setDialogType("View");
        setDataRow(row)
        setOpen(true)
    }


    const handleDeleteAction = (row: {}) => {
        console.log(row)
    }


    return (
        <>
            <Grid
                container
                spacing={2}
                columns={12}
            >
                <Grid sx={{ display: 'flex', alignItems: "center" }} size={{ xs: 6, sm: 6, lg: 6 }}>
                    <Typography component="h2" variant="h6">
                        Prizes
                    </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 6, lg: 6 }}>
                    <Button
                        sx={{
                            float: "right"
                        }}
                        variant="contained"
                        onClick={handleOpenDialog}
                    >
                        Add Prize
                    </Button>
                </Grid>
                <Grid size={12}>
                    <CustomizedDataGrid
                        sx={{
                            width: "100%",
                        }}
                        data={list}
                        headers={sampleHeaders}
                        pagination={pagination}
                        pageLength={listCount}
                        onTableChange={handleTableChange}
                        onEditAction={handleEditAction}
                        onViewAction={handleViewAction}
                        onDeleteAction={handleDeleteAction} />
                </Grid>
            </Grid>
            <MyDialog open={open} dialogType={dialogType} data={data_row} onClose={handleOnClose} />
        </>
    )
}

export default PrizeList;