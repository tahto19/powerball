//@ts-nocheck

import { Box, Card, CardContent, CardMedia, Typography, Button, Grid2 } from "@mui/material";
import apiService from "@/services/apiService";
import { bodyDecrypt } from "@/utils/util";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import moment from "moment";
import {
  initialRaffleData,
  RaffleState,
} from "@/components/GameMaintenance/interface.ts";
import MyDialog from "./Dialog.tsx";
import CustomizedDataGrid from "../CustomizedDataGrid.tsx";

const endpoint = "http://localhost:5128/api/file/serve/image/"

const headers = [
  { field: 'name', headerName: 'Raffle Name', flex: 1, minWidth: 200 },

  {
    field: 'raffleSchedule', headerName: 'Schedule Date', flex: 1, minWidth: 200, renderCell: (params: any) => {
      const value = params.value;
      return moment(value[0].schedule_date).format(
        "MMMM D, YYYY h:mm A")
    },
  },
  // {
  //     field: 'active', headerName: 'Active', flex: 1, minWidth: 200,
  //     renderCell: (params: any) => {
  //         const value = params.value ? 'Active' : 'Inactive'
  //         return renderStatus(value as any)
  //     },
  // }
]
const initialPaginationData = { page: 0, pageSize: 10 }

const RaffleDraw = () => {
  const dispatch = useAppDispatch();
  const [list, setRaffleList] = useState<[]>([]);
  const [data, setData] = useState(initialRaffleData);
  const { token } = useAppSelector((state) => state.token);
  const [listCount, setListCount] = useState<number>(0);
  const [pagination, setPagination] = useState(initialPaginationData);

  const [open, setOpen] = useState(false);
  const [cardData, setCardData] = useState(initialRaffleData);
  const handleClose = () => {
    setOpen(false)
  }

  const handleCardClick = (item: RaffleState) => {
    setOpen(true)
    setCardData(item)
  }

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
    newFilterModel.push({ field: "active", filter: 1, type: "boolean" })

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

  const getRafflesList = async () => {
    if (!token) return;

    const payload = {
      sort: JSON.stringify([["id", "DESC"]]),
      filter: JSON.stringify([{ field: "active", filter: 1, type: "boolean" }]),
    };
    const res = await apiService.getGMListAll(payload, token);

    const d = bodyDecrypt(res.data, token);
    if (d && d.success === "success") {
      setRaffleList(d.data.list);
    }
  };

  // useEffect(() => {
  //   getRafflesList();
  // }, [token]);

  return (
    <>
      <Grid2
        container
        spacing={2}
        columns={12}
      >

        <Grid2 size={12}>
          <CustomizedDataGrid
            sx={{
              width: "100%",
            }}
            data={list}
            headers={headers}
            pagination={pagination}
            pageLength={listCount}
            onTableChange={handleTableChange}
            onViewAction={handleCardClick}
          />
        </Grid2>
      </Grid2>
      <MyDialog open={open} data={cardData} onClose={handleClose} />
    </>
  );
};

export default RaffleDraw;
