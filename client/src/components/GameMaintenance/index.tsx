import * as React from "react";
import CustomizedDataGrid from "../CustomizedDataGrid.tsx";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from '@mui/material/Grid2';
import apiService from "@/services/apiService";
import { useAppSelector } from "@/redux/hook";

import MyDialog from "./Dialog.tsx";
import { RaffleState, RafflePaginationState } from '@/components/GameMaintenance/interface.ts';
import { bodyDecrypt } from "@/utils/util";
import { showToaster } from "@/redux/reducers/global/globalSlice";
import { useAppDispatch } from "@/redux/hook";
import moment from "moment";



//Temporary data
const sampleHeaders = [
    { field: 'details', headerName: 'Raffle ID', flex: 1, minWidth: 200 },
    { field: 'schedule_type', headerName: 'Schedule Type', flex: 1, minWidth: 200 },
    { field: 'active', headerName: 'Active', flex: 1, minWidth: 200 }
]
//Temporary data
const samplePagination = { page: 0, pageSize: 10 }


const defaultData = {
    id: null,
    details: "",
    more_details: "",
    active: true,
    starting_date: moment().toISOString(),
    end_date: null,
    schedule_type: 1,
}

const GameMaintenace = () => {
    const dispatch = useAppDispatch();

    const { token } = useAppSelector((state) => state.token);
    const [dialogType, setDialogType] = React.useState("Add")
    const [data_row, setDataRow] = React.useState<RaffleState>(defaultData);

    const [list, setRaffleList] = React.useState<[]>([]);
    const [listCount, setListCount] = React.useState<number>(0);
    const [pagination, setPagination] = React.useState(samplePagination);

    const [refreshKey, setRefreshKey] = React.useState(0);
    // Call this function when data updates
    const refreshTable = () => setRefreshKey((prev) => prev + 1);

    const handleTableChange = async ({ page, pageSize, sortModel, filterModel }: any) => {
        console.log("Table Changed:", { page, pageSize, sortModel, filterModel });

        setPagination({ page, pageSize })

        const sort = [];
        if (sortModel.length > 0) {
            sort.push([sortModel[0].field, sortModel[0].sort.toUpperCase()]);
        }

        let newFilterModel = [];

        if (filterModel.items.length > 0) {
            newFilterModel = JSON.parse(JSON.stringify(filterModel)).items.map((x: any) => {
                x.filter = x.value;
                x.type = 'string';

                delete x.value;
                delete x.fromInput;
                delete x.id;
                delete x.operator;
                return x;
            })
        }

        const query: RafflePaginationState = {
            offset: page, limit: pageSize, sort: JSON.stringify(sort), filter: JSON.stringify(newFilterModel)
        }

        //   const res = await apiService.getPrizeList(query);

        //   const d = bodyDecrypt(res.data, token)
        //   if (d && d.success === 'success') {
        //       console.log(d)
        //       setRaffleList(d.data.list)
        //       setListCount(d.data.total)
        //   }
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

    const handleEditAction = (row: RaffleState) => {
        setDialogType("Edit");
        setDataRow(row)
        setOpen(true)
    }

    const handleViewAction = (row: RaffleState) => {
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
                    {/* <Typography component="h2" variant="h6">
                        Prizes
                    </Typography> */}
                </Grid>
                <Grid size={{ xs: 6, sm: 6, lg: 6 }}>
                    <Button
                        sx={{
                            float: "right"
                        }}
                        variant="contained"
                        onClick={handleOpenDialog}
                    >
                        Add Raffle Details
                    </Button>
                </Grid>
                <Grid size={12}>
                    <CustomizedDataGrid
                        key={refreshKey} //Changing key forces re-render
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
            <MyDialog open={open} dialogType={dialogType} data={data_row} onClose={handleOnClose} onSubmit={refreshTable} />
        </>
    )
}

export default GameMaintenace;