//@ts-nocheck

import { Box, Card, CardContent, CardMedia, Typography, Button } from "@mui/material";
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

const endpoint = "http://localhost:5128/api/file/serve/image/"

const RaffleDraw = () => {
  const dispatch = useAppDispatch();
  const [list, setRaffleList] = useState<[]>([]);
  const [data, setData] = useState(initialRaffleData);
  const { token } = useAppSelector((state) => state.token);

  const [open, setOpen] = useState(false);
  const [cardData, setCardData] = useState(initialRaffleData);
  const handleClose = () => {
    setOpen(false)
  }

  const handleCardClick = (item: RaffleState) => {
    setOpen(true)
    setCardData(item)
  }

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

  useEffect(() => {
    getRafflesList();
  }, [token]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px"
        }}>
        {list &&
          list.map((x, i) => (
            <Button sx={{ height: "100%" }} onClick={() => handleCardClick(x)}>
              <Card sx={{
                minWidth: 275, display: "flex", gap: "20px", height: "76%", '&:hover': {
                  cursor: "pointer"
                }

              }}>
                {x.fileInfo ? (
                  <CardMedia
                    component="img"
                    image={endpoint + x.fileInfo.id}
                    alt="Lazy-loaded image"
                    loading="lazy"  // Native lazy loading for images
                    sx={{
                      width: "120px"
                    }}
                  />
                ) : null}

                <CardContent>
                  <Typography gutterBottom sx={{ color: 'text.primary', fontWeight: "600", fontSize: 14 }}>
                    {x.name}
                  </Typography>
                  <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 12 }}>
                    Draw on{" "}
                    {moment(x.raffleSchedule[0].schedule_date).format(
                      "MMMM D, YYYY h:mm A"
                    )}
                  </Typography>

                </CardContent>
              </Card>
            </Button>

          ))}
      </Box>
      <MyDialog open={open} data={cardData} onClose={handleClose} />
    </>
  );
};

export default RaffleDraw;
