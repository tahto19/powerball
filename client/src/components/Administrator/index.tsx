import * as React from "react";

import CustomizedDataGrid from "../CustomizedDataFrid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from '@mui/material/Grid2';

import MyDialog from "./Dialog.tsx";


const sampleData = [{
    id: 1,
    first_name: 'Bounty',
    last_name: 'Hunter',
    status: 'Online',

},
{
    id: 2,
    first_name: 'Crystal',
    last_name: 'Maiden',
    status: 'Offline',

}]
const sampleHeaders = [
    { field: 'first_name', headerName: 'First Name', flex: 1, minWidth: 200 },
    { field: 'last_name', headerName: 'Last Name', flex: 1, minWidth: 200 },
    {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        minWidth: 80,
    }
]
const samplePagination = { page: 0, pageSize: 1 }

const Administrator = () => {
    const handleTableChange = ({ page, pageSize, sortModel, filterModel }: any) => {
        console.log("Table Changed:", { page, pageSize, sortModel, filterModel });
    };

    const [open, setOpen] = React.useState(false);
    const handleOnClose = (value: boolean) => {
        setOpen(value)
    }
    const handleOpenDialog = () => {
        setOpen(true)
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
                        Admin Accounts
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
                        Add Administrator
                    </Button>
                </Grid>
                <Grid size={12}>
                    <CustomizedDataGrid
                        sx={{
                            width: "100%",
                        }}
                        data={sampleData}
                        headers={sampleHeaders}
                        pagination={samplePagination}
                        pageLength={sampleData.length}
                        onTableChange={handleTableChange} />
                </Grid>
            </Grid>
            <MyDialog open={open} onClose={handleOnClose} />
        </>
    )
}

export default Administrator;