//@ts-nocheck
import apiService from "@/services/apiService";
import { bodyDecrypt } from "@/utils/util";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hook";

import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Box,
  CircularProgress
} from "@mui/material";
import moment from "moment";
import MyDialog from "./Dialog";

import {
  initialRaffleData,
  RaffleState,
} from "@/components/2ndChance_iFrame/Raffles/interface.ts";
import { getRaffleEntry } from "@/redux/reducers/raffleEntry/asyncCalls";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import IconButton from '@mui/material/IconButton';


const base_url = import.meta.env.VITE_API_BASE_URL;
const endpoint = base_url + "api/file/serve/image/"

const initialPaginationData = { page: 0, pageSize: 3 }

const Raffles = () => {
  const dispatch = useAppDispatch();
  const [list, setRaffleList] = useState<[]>([]);
  const [data, setData] = useState(initialRaffleData);
  const { token } = useAppSelector((state) => state.token);
  const [pagination, setPagination] = useState(initialPaginationData);

  const [isFetching, setIsFetching] = useState(false);

  const getRafflesList = async () => {
    if (!token) return;

    setIsFetching(true);

    const payload = {
      offset: pagination.page,
      limit: pagination.pageSize,
      sort: JSON.stringify([["name", "ASC"]]),
      filter: JSON.stringify([{ field: "active", filter: 1, type: "boolean" }]),
    };
    const res = await apiService.get2ndChanceGMListAll(payload, token);

    const d = bodyDecrypt(res.data, token);
    if (d && d.success === "success") {
      console.log(">>>>>>>>", d.data);
      setRaffleList(d.data.list);
    }
    setIsFetching(false);

  };

  const handleNext = () => {
    if (list.length === 3 && !isFetching) {
      setPagination((prev) => ({
        ...prev,
        page: pagination.page + 1
      }))
    }
  }

  const handlePrev = () => {
    if (pagination.page !== 0 && !isFetching) {
      setPagination((prev) => ({
        ...prev,
        page: pagination.page - 1
      }))
    }
  }

  const handleParticipate = (data: RaffleState) => {
    setData(data);
    setOpen(true);
  };

  const [open, setOpen] = useState(false);
  const handleOnClose = (value: boolean) => {
    setOpen(value);
  };

  const { btnLoading, loading, totalUsedEntries, totalTicket, totalEntries } =
    useAppSelector((state) => state.raffleEntry);
  useEffect(() => {
    if (token) {
      dispatch(getRaffleEntry());
    }
    getRafflesList();
  }, [token, pagination.page]);
  useEffect(() => {
    console.log(loading, totalUsedEntries, totalTicket, totalEntries);
  }, [open]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: '20px'
        }}>
        <Typography sx={{
          fontSize: '24px',
          fontWeight: '600'
        }} >
          Raffle List
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: '12px',
            fontSize: '24px'
          }}>
          <IconButton aria-label="delete" onClick={handlePrev} >
            <PlayCircleOutlineIcon sx={{
              transform: 'rotate(180deg)'
            }} />
          </IconButton>
          <IconButton aria-label="delete" onClick={handleNext} >
            <PlayCircleOutlineIcon />
          </IconButton>

        </Box>
      </Box>
      <div
        style={{
          display: "flex",
          gap: "18px",
          justifyContent: "center",
          alignItems: 'center'
        }}
      >
        {isFetching ? (
          <CircularProgress color="inherit" />
        ) :
          list && list.length > 0 ? (
            list &&
            list.map((x, i) => (
              <Card key={i}
                sx={{
                  width: '258px',
                  height: '288px',
                  padding: '12px',
                  borderRadius: '20px',
                  background: '#FFF',
                  boxShadow: '0px 14px 42px 0px rgba(8, 15, 52, 0.06)',
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  {x.fileInfo ? (
                    <CardMedia
                      component="img"
                      sx={{ height: '113px' }}
                      image={endpoint + x.fileInfo.id}
                      alt="Paella dish"
                    />
                  ) : null}

                  <CardContent>
                    <div
                      style={{
                        padding: '10px 0',
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{ color: "text.secondary", fontSize: '14px', fontWeight: '500' }}
                      >
                        {x.name}
                      </Typography>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        sx={{ color: "text.secondary", fontSize: '14px' }}
                      >
                        Total Entries: {x.totalEntries}
                      </Typography>
                      <Typography
                        sx={{ color: "text.secondary", fontSize: '14px' }}
                      >
                        Your Entries: {x.yourEntries}
                      </Typography>
                      <Typography
                        sx={{ color: "text.secondary", fontSize: '14px' }}
                      >
                        Draw on{" "}
                        {moment(x.raffleSchedule[0].schedule_date).format(
                          "MMMM D, YYYY h:mm A"
                        )}
                      </Typography>
                    </div>
                  </CardContent>
                </Box>
                <CardActions sx={{ mt: '10px' }}>
                  <Button
                    onClick={() => handleParticipate(x)}
                    variant="contained"
                    sx={{ width: "100%" }}
                  >
                    Participate
                  </Button>
                </CardActions>
              </Card>
            ))
          ) : (
            <Box>
              <Typography
                sx={{ padding: "40px", color: "text.secondary", fontSize: '14px', fontWeight: '500' }}
              >
                No Raffle Available
              </Typography>
            </Box>
          )
        }
      </div>
      <MyDialog
        open={open}
        data={data}
        onClose={handleOnClose}
        totalEntries={totalEntries}
        totalUsedEntries={totalUsedEntries}
        btnLoading={btnLoading}
      />
    </>
  );
};

export default Raffles;
