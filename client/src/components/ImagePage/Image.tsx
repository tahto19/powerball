import apiService from "@/services/apiService";
import { bodyDecrypt } from "@/utils/util";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hook";

import { Grid2, Button } from "@mui/material";
import { initialImageData } from "./interface.ts";
import MyDialog from "./Dialog";

const ImagePage = () => {
    const { token } = useAppSelector((state) => state.token);
    const [dialogType, setDialogType] = useState("Add")
    const [dataRow, setDataRow] = useState(initialImageData);

    const [refreshKey, setRefreshKey] = useState(0);
    // Call this function when data updates
    const refreshTable = () => setRefreshKey((prev) => prev + 1);

    const [open, setOpen] = useState(false);
    const handleOnClose = (value: boolean) => {
        setOpen(value)
    }

    const handleOpenDialog = () => {
        setDialogType("Add");
        setDataRow(initialImageData)
        setOpen(true)
    }

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
                            float: "right"
                        }}
                        variant="contained"
                        onClick={handleOpenDialog}
                    >
                        Add Image
                    </Button>
                </Grid2>
                <Grid2 size={12}>
                    {/* <CustomizedDataGrid
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
                               onDeleteAction={handleDeleteAction} /> */}
                </Grid2>
            </Grid2>
            <MyDialog open={open} data={dataRow} dialogType={dialogType} onClose={handleOnClose} onSubmit={refreshTable} />
        </>
    )
}

export default ImagePage;