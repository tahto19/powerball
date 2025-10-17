//@ts-nocheck
import {
  Box,
  Dialog,
  DialogContent,
  Grid2,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { useEffect, useState } from "react";
import { bodyDecrypt } from "@/utils/util";
import apiService from "@/services/apiService";

interface DialogProps {
  open: boolean;
  onClose: (value: boolean) => void | null | undefined;
}

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

interface RaffleListItem {
  name: string;
  entries: number;
}
type RaffleList = RaffleListItem[];

interface TicketListItem {
  alphaCode: string;
  availableEntries: number;
  raffles: [];
}
type TicketList = TicketListItem[];

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const EntriesDialog = ({ open, onClose }: DialogProps) => {
  // const raffleDetails = useAppSelector((state) => {
  //     console.log(state)
  //     return state.raffle
  // });
  // const { rafflesList } = raffleDetails

  const [ticketList, setTicketList] = useState<TicketList>([]);
  const [raffleList, setRaffleList] = useState<RaffleList>([]);

  const handleClose = () => {
    onClose(false);
  };
  const { token } = useAppSelector((state) => state.token);

  const getTicketDetails = async () => {
    if (!token) return;
    const payload = {
      offset: 0,
      limit: 20,
      sort: [],
      filter: [],
    };
    const res = await apiService.getTicketDetails(payload, token);
    let d = bodyDecrypt(res.data, token);

    if (d) {
      let new_raffle: any = [];
      let new_ticket_list: any = [];
      console.log("000000", d);

      d.forEach((x: any) => {
        const f = new_ticket_list.find((c: any) => c.alphaCode === x.alphaCode);

        if (f) {
          f.availableEntries += x.availableEntries;
        } else {
          new_ticket_list.push({
            alphaCode: x.alphaCode,
            availableEntries: x.availableEntries,
          });
        }

        x.raffles.forEach((z: any) => {
          const find = new_raffle.find((c: any) => c.name === z.name);
          if (find) {
            find.entries += x.availableEntries;
          } else {
            new_raffle.push({ name: z.name, entries: x.availableEntries });
          }
        });
      });
      setTicketList(new_ticket_list);
      setRaffleList(new_raffle);
    }
  };
  useEffect(() => {
    getTicketDetails();
  }, [token]);

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        {/* <DialogTitle>Available Raffle Tickets</DialogTitle> */}
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            minWidth: "300px",
            maxWidth: "400px",
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Box>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab
                  label="Tickets"
                  {...a11yProps(0)}
                />
                <Tab
                  label="Raffles"
                  {...a11yProps(1)}
                />
              </Tabs>
            </Box>
            <CustomTabPanel
              value={value}
              index={0}
            >
              <Typography sx={{ fontSize: "12px", marginBottom: "15px" }}>
                These are the tickets you currently own.
              </Typography>
              <Box
                sx={{
                  marginBottom: "8px",
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <Grid2
                  container
                  spacing={2}
                  columns={12}
                >
                  <Grid2 size={{ xs: 6, sm: 6, md: 6, lg: 6 }}>
                    <Typography sx={{ fontSize: "12px", fontWeight: "600" }}>
                      Ticket
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 6, sm: 6, md: 6, lg: 6 }}>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        float: "right",
                        fontWeight: "600",
                      }}
                    >
                      # of Entries
                    </Typography>
                  </Grid2>
                </Grid2>
              </Box>
              <Grid2
                container
                spacing={1}
                columns={12}
              >
                {ticketList.length > 0 &&
                  ticketList.map((x) => (
                    <>
                      <Grid2 size={{ xs: 9, sm: 9, md: 9, lg: 9 }}>
                        <Typography
                          sx={{
                            color: "#81858c !important",
                            fontSize: "12px",
                            textWrap: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {x.alphaCode}
                        </Typography>
                      </Grid2>
                      <Grid2 size={{ xs: 3, sm: 3, md: 3, lg: 3 }}>
                        <Typography
                          sx={{
                            color: "#121214 !important",
                            fontSize: "12px",
                            float: "right",
                          }}
                        >
                          {x.availableEntries}
                        </Typography>
                      </Grid2>
                    </>
                  ))}
              </Grid2>
            </CustomTabPanel>
            <CustomTabPanel
              value={value}
              index={1}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  marginBottom: "15px",
                }}
              >
                Here is the list of raffles you can join.
              </Typography>
              <Box
                sx={{
                  marginBottom: "8px",
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <Grid2
                  container
                  spacing={2}
                  columns={12}
                >
                  <Grid2 size={{ xs: 6, sm: 6, md: 6, lg: 6 }}>
                    <Typography sx={{ fontSize: "12px", fontWeight: "600" }}>
                      Raffle
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 6, sm: 6, md: 6, lg: 6 }}>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        float: "right",
                        fontWeight: "600",
                      }}
                    >
                      # of Entries Available
                    </Typography>
                  </Grid2>
                </Grid2>
              </Box>
              <Grid2
                container
                spacing={1}
                columns={12}
              >
                {raffleList.length > 0 &&
                  raffleList.map((x) => (
                    <>
                      <Grid2 size={{ xs: 9, sm: 9, md: 9, lg: 9 }}>
                        <Typography
                          sx={{
                            color: "#81858c !important",
                            fontSize: "12px",
                            textWrap: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {x.name}
                        </Typography>
                      </Grid2>
                      <Grid2 size={{ xs: 3, sm: 3, md: 3, lg: 3 }}>
                        <Typography
                          sx={{
                            color: "#121214 !important",
                            fontSize: "12px",
                            float: "right",
                          }}
                        >
                          {x.entries}
                        </Typography>
                      </Grid2>
                    </>
                  ))}
              </Grid2>
            </CustomTabPanel>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EntriesDialog;
