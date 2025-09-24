//@ts-nocheck
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { Button, Grid2, Chip } from "@mui/material";

import { initialRaffleData, RaffleState, RafflePaginationState } from '@/components/GameMaintenance/interface.ts';
import { PrizeListAll } from "@/components/PrizeList/interface";

import { bodyDecrypt } from "@/utils/util";
import apiService from "@/services/apiService";

import MyDialog from "./Dialog.tsx";
import CustomizedDataGrid from "../CustomizedDataGrid.tsx";
import moment from "moment";
import { showToaster } from "@/redux/reducers/global/globalSlice"
import { openDialog } from "@/redux/reducers/download/exportDataSlice";
import { toast } from "react-toastify";


const renderStatus = (status: 'Ended' | 'Active') => {
    const colors: { [index: string]: 'success' | 'error' } = {
        Active: 'success',
        Ended: 'error',
    };

    return <Chip label={status} color={colors[status]} size="small" />;
}

const renderType = (status: 'Daily' | 'Weekly') => {
    const colors: { [index: string]: 'primary' | 'secondary' } = {
        Daily: 'primary',
        Weekly: 'secondary',
    };

    return <Chip label={status} color={colors[status]} size="small" />;
}

const headers = [
    { field: 'details', headerName: 'Raffle ID', flex: 1, minWidth: 200 },
    { field: 'name', headerName: 'Raffle Name', flex: 1, minWidth: 200 },

    {
        field: 'schedule_type', headerName: 'Schedule Type', flex: 1, minWidth: 200, renderCell: (params: any) => {
            const value = params.value === 1 ? 'Daily' : 'Weekly'
            return renderType(value as any)
        },
    },
    // {
    //     field: 'active', headerName: 'Active', flex: 1, minWidth: 200,
    //     renderCell: (params: any) => {
    //         const value = params.value ? 'Active' : 'Inactive'
    //         return renderStatus(value as any)
    //     },
    // }
    {
        field: 'end_date', headerName: 'Status', flex: 1, minWidth: 200,
        renderCell: (params: any) => {
            const value = moment().isAfter(params.value) ? 'Ended' : 'Active'
            return renderStatus(value as any)
        },
    }
]
const initialPaginationData = { page: 0, pageSize: 10 }

// UPDATE `Customize_Questions` SET `Company_ID_Link`=13 WHERE `Project_ID_Link`=23;
// UPDATE `Customize_Popup_Message` SET `Company_ID_Link`=13 WHERE `Project_ID_Link`=23;
// UPDATE `Customize_Opening_Message` SET `Company_ID_Link`=13 WHERE `Project_ID_Link`=23;
// UPDATE `Customize_Logo` SET `Company_ID_Link`=13 WHERE `Project_ID_Link`=23;
// UPDATE `Customize_Error_Message` SET `Company_ID_Link`=13 WHERE `Project_ID_Link`=23;
// UPDATE `Customize_Color` SET `Company_ID_Link`=13 WHERE `Project_ID_Link`=23;
// UPDATE `Customize_Avatar` SET `Company_ID_Link`=13 WHERE `Project_ID_Link`=23;
// UPDATE `Chat_History` SET `Company_ID_Link`=13 WHERE `Project_ID_Link`=23;
// UPDATE `Authorize_IP_Address` SET `Company_ID_Link`=13 WHERE `Project_ID_Link`=23;


const initialPrizeListData: PrizeListAll = {
    list: [],
    count: 0
}
const GameMaintenace = () => {
    const dispatch = useAppDispatch();
    const { myPermission } = useAppSelector((state: RootState) => state.userType);

    const { token } = useAppSelector((state) => state.token);
    const [dialogType, setDialogType] = useState("Add")
    const [dataRow, setDataRow] = useState(initialRaffleData);

    const [list, setRaffleList] = useState<[]>([]);
    const [listCount, setListCount] = useState<number>(0);
    const [pagination, setPagination] = useState(initialPaginationData);
    const [prizeList, setPrizeList] = useState(initialPrizeListData);

    const [refreshKey, setRefreshKey] = useState(0);
    // Call this function when data updates
    const refreshTable = () => setRefreshKey((prev) => prev + 1);

    const handleTableChange = async ({ page, pageSize, sortModel, filterModel }: any) => {
        setPagination({ page, pageSize })

        let sort = [['id', 'DESC']];
        if (sortModel.length > 0) {
            sort = [[sortModel[0].field, sortModel[0].sort.toUpperCase()]];
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

        const res = await apiService.getGMList(query, token);

        const d = bodyDecrypt(res.data, token)
        if (d && d.success === 'success') {
            setRaffleList(d.data.list)
            setListCount(d.data.total)
        }
    };

    const [open, setOpen] = useState(false);
    const handleOnClose = (value: boolean) => {
        setOpen(value)
    }

    const handleExport = () => {
        if (!myPermission.game_maintenance.export) {
            toast.info("You're not allowed to Export");
            return;
        }
        dispatch(openDialog({ title: 'Game Maintenance Export', type: 9, filter: [] }))

    }

    const handleOpenDialog = () => {
        if (!myPermission.game_maintenance.add) {
            toast.info("You're not allowed to Add");
            return;
        }
        setDialogType("Add");
        setDataRow(initialRaffleData)
        setOpen(true)
    }

    const handleEditAction = (row: RaffleState) => {
        if (!myPermission.game_maintenance.edit) {
            toast.info("You're not allowed to Edit");
            return;
        }

        if (row && moment().isAfter(row.end_date)) {
            dispatch(showToaster({
                message: "Raffle already ended.",
                show: true,
                variant: "error",
                icon: null,
            }))
            return;
        }
        setDialogType("Edit");
        setDataRow({ ...row })
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


    useEffect(() => {
        const fetch = async () => {
            const payload = {
                sort: JSON.stringify([["id", "DESC"]]),
                filter: ""
            }
            const res = await apiService.getPrizeListAll(payload, token);
            const d = bodyDecrypt(res.data, token)

            if (d && d.success === 'success') {
                setPrizeList(d.data)
            }
        }

        fetch();
    }, [token])
    return (
        <>
            <Grid2
                container
                spacing={2}
                columns={12}
            >
                <Grid2 sx={{ display: 'flex', alignItems: "center" }} size={{ xs: 6, sm: 6, lg: 6 }}>
                    {/* <Typography component="h2" variant="h6">
                        Prizes
                    </Typography> */}
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 6, lg: 6 }}>
                    <Button
                        sx={{
                            float: "right",
                            marginLeft: "10px"
                        }}
                        variant="outlined"
                        onClick={handleExport}
                    >
                        Export
                    </Button>
                    <Button
                        sx={{
                            float: "right"
                        }}
                        variant="contained"
                        onClick={handleOpenDialog}
                    >
                        Add Raffle Details
                    </Button>
                </Grid2>
                <Grid2 size={12}>
                    <CustomizedDataGrid
                        key={refreshKey} //Changing key forces re-render
                        sx={{
                            width: "100%",
                        }}
                        data={list}
                        headers={headers}
                        pagination={pagination}
                        pageLength={listCount}
                        onTableChange={handleTableChange}
                        onEditAction={handleEditAction}
                        onViewAction={handleViewAction}
                    // onDeleteAction={handleDeleteAction} 
                    />
                </Grid2>
            </Grid2>
            <MyDialog open={open} prizeList={prizeList} dialogType={dialogType} data={dataRow} onClose={handleOnClose} onSubmit={refreshTable} />
        </>
    )
}

export default GameMaintenace;