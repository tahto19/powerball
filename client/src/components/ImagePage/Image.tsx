import apiService from "@/services/apiService";
import { bodyDecrypt } from "@/utils/util";
import { useState } from "react";
import { useAppSelector } from "@/redux/hook";

import { Grid2, Button } from "@mui/material";
import { initialImageData } from "./interface.ts";
import MyDialog from "./Dialog";
import { getDataV2 } from "@/types/allTypes";
import CustomizedDataGrid from "../CustomizedDataGrid.tsx";
import { Card, CardMedia } from '@mui/material';

import { ImageState } from "./interface.ts"
const base_url = import.meta.env.VITE_API_BASE_URL;
const apiEndpoint = base_url + "api/file/serve/image/"
const renderImage = (id: number) => {

    const img = apiEndpoint + id
    return (
        <div style={{
            display: 'flex',
            justifyContent: "center",
            alignItems: 'center',
            height: '100%'
        }}>
            <Card sx={{
                height: "30px",
                width: "30px",
                display: 'flex',
                justifyContent: "center",
                alignItems: 'center',
                padding: '10px'
            }}>
                <CardMedia
                    component="img"
                    image={img}
                    alt="Lazy-loaded image"
                    loading="lazy"  // Native lazy loading for images
                />
            </Card>
        </div>

    )

}
const headers = [
    {
        field: 'id', headerName: ' ', maxWidth: 100, sortable: false, filterable: false, renderCell: (params: any) => {
            console.log(params)
            return renderImage(params.id);
        },
    },
    { field: 'name', headerName: 'Image Name', flex: 1, minWidth: 200 },
    { field: 'description', headerName: 'Description', flex: 1, minWidth: 200 },
]
const initialPaginationData = { page: 0, pageSize: 10 }

const ImagePage = () => {
    const { token } = useAppSelector((state) => state.token);
    const [dialogType, setDialogType] = useState("Add")
    const [dataRow, setDataRow] = useState(initialImageData);
    const [list, setImageList] = useState<[]>([]);

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

    const [pagination, setPagination] = useState(initialPaginationData);
    const [listCount, setListCount] = useState<number>(0);

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
        newFilterModel = [...newFilterModel, { field: 'type', filter: 'image', type: 'string' }]

        const query: getDataV2 = {
            offset: page, limit: pageSize, sort: sort, filter: newFilterModel, location: null
        }

        const res = await apiService.getFile(query, token);
        console.log(res)
        const d = bodyDecrypt(res.data, token)
        if (d && d.success === 'success') {
            setImageList(d.data.list)
            setListCount(d.data.total)
        }
    };


    const handleEditAction = (row: ImageState) => {
        console.log("-------", row)
        setDialogType("Edit");
        setDataRow({ ...row })
        setOpen(true)
    }

    const handleViewAction = (row: ImageState) => {
        setDialogType("View");
        setDataRow(row)
        setOpen(true)
    }


    const handleDeleteAction = (row: {}) => {
        console.log(row)
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
                    <CustomizedDataGrid
                        key={refreshKey} //Changing key forces re-render
                        sx={{
                            width: "100%",
                        }}
                        data={list}
                        headers={headers}
                        pagination={pagination}
                        pageLength={listCount}
                        rowHeight={100}
                        onTableChange={handleTableChange}
                        onEditAction={handleEditAction}
                        onViewAction={handleViewAction}
                        onDeleteAction={handleDeleteAction} />
                </Grid2>
            </Grid2>
            <MyDialog open={open} data={dataRow} dialogType={dialogType} onClose={handleOnClose} onSubmit={refreshTable} />
        </>
    )
}

export default ImagePage;