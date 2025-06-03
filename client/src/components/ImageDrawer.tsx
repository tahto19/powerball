import React, { useEffect, useState } from 'react';
import { getDataV2 } from "@/types/allTypes";
import apiService from "@/services/apiService";
import { useAppSelector } from "@/redux/hook";
import { bodyDecrypt } from "@/utils/util";
import { ImageDrawerProps } from "@/components/ImagePage/interface";

import { Skeleton, Box, Drawer, List, Divider, ListItem, ListItemButton, CardMedia, Typography, DialogTitle, Pagination, Stack } from '@mui/material';

import { ImageState } from "@/components/ImagePage/interface"

const base_url = import.meta.env.VITE_API_BASE_URL;
const apiEndpoint = base_url + "api/file/serve/image/"
const ImageDrawer = ({ open, onChoose, onClose }: ImageDrawerProps) => {
    const { token } = useAppSelector((state) => state.token);
    const [list, setImageList] = useState<ImageState[]>([]);
    const [listCount, setListCount] = useState<number>(1);
    const [isFetching, setFetching] = useState(false);

    const [isOpen, setOpen] = useState(open)
    const handleClose = () => {
        onClose(false);
    }

    const pageSize = 6
    const getImageList = async (page = 0) => {
        setFetching(true)
        const query: getDataV2 = {
            offset: page, limit: pageSize, sort: [['id', 'DESC']], filter: [], location: null
        }

        const res = await apiService.getFile(query, token);
        const d = bodyDecrypt(res.data, token)
        console.log(d)
        if (d && d.success === 'success') {
            setImageList(d.data.list)

            if (d.data.total > pageSize) {
                const new_count = Math.ceil(d.data.total / pageSize);
                setListCount(new_count)
            }
        }
        setFetching(false)

    }

    const handleNewPage = (event: any) => {
        getImageList(Number(event.target.innerText) - 1)
    }

    const handleRowClick = (item: ImageState) => {
        console.log(item)
        onChoose(item)
    }
    useEffect(() => {
        if (open) {
            getImageList()
        }
        setOpen(open)
    }, [open])
    return (
        <div>
            <React.Fragment>
                <Drawer
                    sx={{
                        zIndex: "1300"
                    }}
                    anchor='right'
                    open={isOpen}
                    onClose={handleClose}
                >
                    <Box sx={{
                        width: 350, display: "flex", flexDirection: 'column', height: '100%'
                    }} role="presentation">
                        <DialogTitle>Image List</DialogTitle>
                        <Divider />
                        <div style={{
                            display: "flex", flexDirection: 'column', alignItems: 'space-between'
                        }}>
                            <List sx={{
                                height: "100%"
                            }}>
                                {
                                    isFetching ?

                                        Array.from({ length: 6 }).map(() => (
                                            <ListItem sx={{
                                                marginBottom: '2px'
                                            }} disablePadding >
                                                <Skeleton variant="rectangular" width="100%" height={80} />
                                            </ListItem>
                                        ))
                                        : !isFetching && list.length === 0 ? (
                                            <ListItem sx={{
                                                marginBottom: '2px'
                                            }} disablePadding >
                                                <Typography variant="subtitle2" sx={{
                                                    padding: "15px 0",
                                                    width: "100%",
                                                    textAlign: "center"
                                                }}> No Data Found</Typography>
                                            </ListItem>
                                        ) :
                                            list.map((item, index) => (
                                                <ListItem key={index} sx={{
                                                    borderBottom: '1px solid #ccc'
                                                }} disablePadding >
                                                    <ListItemButton onDoubleClick={() => handleRowClick(item)} sx={{ display: "flex", alignItems: "flex-start", gap: "20px !important", opacity: "1 !important" }}>
                                                        <div style={{
                                                            width: "80px",
                                                            height: "80px",
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            overflow: "hidden",
                                                        }}>
                                                            <CardMedia
                                                                component="img"
                                                                image={apiEndpoint + item.id}
                                                                alt="Lazy-loaded image"
                                                                loading="lazy"  // Native lazy loading for images
                                                            />
                                                        </div>
                                                        <Box sx={{ width: "100%", }}>
                                                            <Typography variant="subtitle2" sx={{
                                                                padding: "15px 0",
                                                                width: "100%",
                                                                whiteSpace: "nowrap",
                                                                textOverflow: 'ellipsis',
                                                                overflow: 'hidden'
                                                            }}> {item.name}</Typography>
                                                        </Box>
                                                    </ListItemButton>
                                                </ListItem>
                                            ))}
                            </List>
                            <Stack sx={{
                                padding: '15px 0',
                                display: "flex",
                                alignItems: 'center'
                            }}>
                                {
                                    list.length > 0 && (<Pagination count={listCount} shape="rounded" onClick={handleNewPage} />)
                                }
                            </Stack>
                        </div>

                    </Box>
                </Drawer>
            </React.Fragment>
        </div >
    )
}

export default ImageDrawer;