import * as React from "react";

import CustomizedDataGrid from "../CustomizedDataFrid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from '@mui/material/Grid2';
import Chip from '@mui/material/Chip';

import MyDialog from "./Dialog.tsx";

interface DataProps {
    id: number | null,
    first_name: string,
    last_name: string,
    mobile_number: string,
    email: string,
    status: string,
    password: string | null;
}

const renderStatus = (status: 'Online' | 'Offline') => {
    const colors: { [index: string]: 'success' | 'default' } = {
        Online: 'success',
        Offline: 'default',
    };

    return <Chip label={status} color={colors[status]} size="small" />;
}

//Temporary data
const sampleData = [{
    id: 1,
    first_name: 'Bounty',
    last_name: 'Hunter',
    mobile_number: "09999999999",
    email: 'asdas@gmail.com',
    status: 'Online',

},
{
    id: 2,
    first_name: 'Crystal',
    last_name: 'Maiden',
    mobile_number: "09999999999",
    email: 'asdas@gmail.com',
    status: 'Offline',

}]
//Temporary data
const sampleHeaders = [
    { field: 'first_name', headerName: 'First Name', flex: 1, minWidth: 200 },
    { field: 'last_name', headerName: 'Last Name', flex: 1, minWidth: 200 },
    { field: 'mobile_number', headerName: 'Mobile Number', flex: 1, minWidth: 200 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 200, minHeight: 400, },
    {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        minWidth: 80,
        renderCell: (params: any) => renderStatus(params.value as any)
    }
]
//Temporary data
const samplePagination = { page: 0, pageSize: 1 }


const defaultData = {
    id: null,
    first_name: "",
    last_name: "",
    mobile_number: "",
    email: "",
    status: "",
    password: null
}

const Administrator = () => {
    const [dialogType, setDialogType] = React.useState("Add")
    const [data_row, setDataRow] = React.useState<DataProps>(defaultData);
    const handleTableChange = ({ page, pageSize, sortModel, filterModel }: any) => {
        console.log("Table Changed:", { page, pageSize, sortModel, filterModel });
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

    const handleEditAction = (row: DataProps) => {
        setDialogType("Edit");
        setDataRow(row)
        setOpen(true)
    }

    const handleViewAction = (row: DataProps) => {
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

export default Administrator;