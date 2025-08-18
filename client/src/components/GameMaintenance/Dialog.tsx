//@ts-nocheck
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { showToaster } from "@/redux/reducers/global/globalSlice"
import moment from "moment";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Tabs, Tab, Checkbox, Autocomplete, Select, ListItemText, Chip, TextField, Box, Switch, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, Button, FormLabel, FormControlLabel, Grid2 } from '@mui/material';
import MuiFormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';

import { PayloadState, RaffleState, MyDialogProps } from '@/components/GameMaintenance/interface.ts';
import { PrizeListAll, initialPrizeListData, PrizeState } from '@/components/PrizeList/interface.ts';

import apiService from "@/services/apiService";
import { bodyDecrypt } from "@/utils/util";
import PrizeListDialog from "./PrizeListDialog";
import CustomizedDataGridBasic from "../CustomizedDataGridBasic";
import { paginationModel } from "./DataGridDetails.ts";

import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import ImageIcon from '@mui/icons-material/Image';
import ImageDrawer from "@/components/ImageDrawer.tsx";
import Participants from "./ParticipantsTable.tsx";
import { openDialog } from "@/redux/reducers/download/exportDataSlice";

import { getAlphaCodeList, getAllAlphaCode } from "@/redux/reducers/alphaCode/asyncCalls.ts";


const renderType = (status: 'minor' | 'major' | 'grand') => {
    const colors: { [index: string]: '#4FC3F7' | '#FFA726' | '#AB47BC' } = {
        minor: '#4FC3F7',
        major: '#FFA726',
        grand: '#AB47BC',
    };

    return <Chip label={status} sx={{
        background: colors[status], '& .MuiChip-label': {
            color: '#fff',
        },
    }} size="small" />;
}
const columnHeader = [
    { field: 'name', headerName: 'Prize Name', flex: 1, },
    {
        field: 'type', headerName: 'Type', flex: 1, renderCell: (params: any) => {

            // return renderType(params.value as any)
            return params.value;
        },
    },
    { field: 'value', headerName: 'Amount', flex: 1, },
]
const FormControl = styled(MuiFormControl)(() => ({
    width: "100%"
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 20,
        },
    },
};

// const alphaCodes = [
//     'GB',
//     'RH',
//     'G20',
//     'G50',
//     'G00',
//     'IK',
//     'RR',
//     'MT'
// ];

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
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
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const MyDialog = ({ open, prizeList, data, dialogType, onClose, onSubmit }: MyDialogProps) => {
    const dispatch = useAppDispatch();
    // const [isOpen, setOpen] = useState(open);
    const [dialog_type, setDialogType] = useState("")
    const [formData, setData] = useState<RaffleState>(data);
    const { token } = useAppSelector((state) => state.token);
    const [prize_List, setPrizeList] = useState<PrizeListAll>(initialPrizeListData);
    const [selectedPrize, setSelectedPrize] = useState<PrizeState[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const [alphaCodes, setAlphaCodes] = useState([]);


    const { getData, list, mainLoading, count } = useAppSelector(
        (s) => s.alphaCode
    );

    const handlePrizeSubmit = (list: number[]) => {
        const prizelist = JSON.parse(JSON.stringify(prize_List))
        const selected_prize = prizelist.list.filter((x: any) =>
            list.some(z => Number(z) === Number(x.id))
        );
        setSelectedPrize(selected_prize)
    }

    const [tabValue, setTab] = useState(0)
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    }

    const handleExport = () => {
        dispatch(openDialog({ title: formData.name + ' Participants', type: 7, filter: [{ field: 'id', filter: data.raffleSchedule[0].id, type: 'number' }] }))
    }
    const handleSubmit = async (e: React.FocusEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            let message;
            let res;

            const payload: PayloadState = {
                formData,
                newPrizeList: selectedPrize.map(x => ({ id: Number(x.id), value: x.value }))
            }

            if (dialogType === 'Edit') {
                res = await apiService.updateGM(payload, token);
                message = "Record updated successfully."
            } else {
                res = await apiService.createGM(payload, token);
                message = "Record created successfully."
            }

            const d = bodyDecrypt(res.data, token)
            if (d && d.success === 'success') {
                dispatch(showToaster({
                    message: message,
                    show: true,
                    variant: "success",
                    icon: null,
                }))
                onClose(false);
                onSubmit()

            } else {
                setSubmitting(false);
                dispatch(showToaster({
                    message: d.message,
                    show: true,
                    variant: "error",
                    icon: null,
                }))
            }
        } catch (err) {
            setSubmitting(false);
            dispatch(showToaster({ err, variant: "error", icon: "error" }));
            return false;
        }

    }

    const handlePrizeNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const amount = prize_List.list.filter((x) => Number(x.id) === Number(value))
        setData((prevData) => ({
            ...prevData,
            prize_id: value ?? "",
            amount: amount[0].value
        }));
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | moment.Moment, name?: string) => {


        if (moment.isMoment(event)) {
            // If the change comes from DateTimePicker
            setData((prevData) => ({
                ...prevData,
                [name as string]: event ? event.toISOString() : null, // Store as ISO string
            }));
        } else {
            // Regular input change
            const { name, value } = event.target;
            console.log(name)
            console.log(value)
            console.log(formData)

            setData((prevData) => ({
                ...prevData,
                [name]: name === "active" ? !prevData.active : value,
            }));
        }
    };

    const handleClose = () => {
        onClose(false);
    };

    useEffect(() => {
        setData(data)
        setDialogType(dialogType)
        setPrizeList(prizeList)

        const selected_prize = prizeList.list.filter(x =>
            data.raffleSchedule[0].prizeInfo.some(z => Number(z.prize_id) === Number(x.id))
        );

        setSelectedPrize(selected_prize)
        setSubmitting(false);
    }, [data, dialogType, prizeList])

    const [openPrizeList, setOpenPrizeListDialog] = useState(false);
    const handleOnClosePrizeList = (value: boolean) => {
        setOpenPrizeListDialog(value)
    }
    const handleOpenPrizeListDialog = () => {
        setOpenPrizeListDialog(true)
    }

    const [imageDrawer, setImageDrawer] = useState(false)
    const handleImage = () => {
        console.log('open')
        setImageDrawer(true)
    }

    const handleImageDrawerClose = (value) => {
        setImageDrawer(value)
    }

    const handleImageRow = (item) => {
        const id = item.id;
        setImageDrawer(false)
        setData((prev) => ({
            ...prev,
            fileInfo: {
                id: item.id,
                name: item.name,
                description: item.description,
            }
        }))
    }

    useEffect(() => {
        if (token !== null) {
            dispatch(getAllAlphaCode());
        }
    }, [token]);
    useEffect(() => {
        console.log(list)
        if (list && list.length > 0) {
            setAlphaCodes(list.map(x => x.name))
        }
    }, [list]);

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}

            >
                <form onSubmit={handleSubmit}>
                    <DialogTitle>{dialog_type} Raffle Details</DialogTitle>
                    <DialogContent sx={{
                        display: "flex",
                        flexDirection: "column"
                    }}>
                        <Box >
                            <FormControl sx={{
                                display: "flex",
                                alignItems: "end",
                                height: "100%"
                            }}>
                                <FormControlLabel control={<Switch name="active" checked={formData.active === true} onChange={(event) => handleInputChange(event)} />} label="Active" />
                            </FormControl>
                        </Box>
                        <Grid2
                            container
                            spacing={2}
                            columns={12}
                        >
                            <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                <FormControl>
                                    <FormLabel htmlFor="details">Raffle ID</FormLabel>
                                    <TextField
                                        id="details"
                                        type="text"
                                        name="details"
                                        placeholder=""
                                        autoComplete="details"
                                        autoFocus
                                        fullWidth
                                        disabled
                                        value={formData.details}
                                        onChange={(event) => handleInputChange(event)}
                                        variant="outlined"
                                        slotProps={{
                                            input: {
                                                readOnly: dialog_type === 'View',
                                            },
                                        }}
                                    />
                                </FormControl>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                                <FormControl>
                                    <FormLabel htmlFor="name">Raffle Name</FormLabel>
                                    <TextField
                                        id="name"
                                        type="text"
                                        name="name"
                                        placeholder=""
                                        autoFocus
                                        required
                                        fullWidth
                                        value={formData.name}
                                        onChange={(event) => handleInputChange(event)}
                                        variant="outlined"
                                        slotProps={{
                                            input: {
                                                readOnly: dialog_type === 'View',
                                            },
                                        }}
                                    />
                                </FormControl>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                                <FormControl>
                                    <FormLabel htmlFor="schedule_type">Schedule Type</FormLabel>
                                    <TextField
                                        select
                                        id="schedule_type"
                                        type="text"
                                        name="schedule_type"
                                        autoComplete="schedule_type"
                                        autoFocus
                                        required
                                        fullWidth
                                        variant="outlined"
                                        value={formData.schedule_type}
                                        onChange={(event) => handleInputChange(event)}
                                        slotProps={{
                                            input: {
                                                readOnly: dialog_type === 'View',
                                            },
                                        }}

                                    >
                                        <MenuItem value={'1'}>Daily</MenuItem>
                                        <MenuItem value={'2'}>Weekly</MenuItem>
                                    </TextField>
                                </FormControl>
                            </Grid2>

                            <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                                <FormControl>
                                    <FormLabel htmlFor="value">Start Date</FormLabel>
                                    <LocalizationProvider dateAdapter={AdapterMoment}>
                                        <DateTimePicker views={['year', 'month', 'day', 'hours', 'minutes']} name="starting_date" onChange={(date: any) => handleInputChange(date, "starting_date")} // Pass name explicitly
                                            value={formData.starting_date ? moment(formData.starting_date) : moment()} />
                                    </LocalizationProvider>
                                </FormControl>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                                <FormControl>
                                    <FormLabel htmlFor="value">End Date</FormLabel>
                                    <LocalizationProvider dateAdapter={AdapterMoment}>
                                        <DateTimePicker views={['year', 'month', 'day', 'hours', 'minutes']} name="end_date" onChange={(date: any) => handleInputChange(date, "end_date")} // Pass name explicitly
                                            value={formData.end_date ? moment(formData.end_date) : moment()} />
                                    </LocalizationProvider>
                                </FormControl>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                                <FormControl>
                                    <FormLabel htmlFor="value">Draw Date</FormLabel>
                                    <LocalizationProvider dateAdapter={AdapterMoment}>
                                        <DateTimePicker views={['year', 'month', 'day', 'hours', 'minutes']} name="draw_date" onChange={(date: any) => handleInputChange(date, "draw_date")} // Pass name explicitly
                                            value={formData.draw_date ? moment(formData.draw_date) : moment()} />
                                    </LocalizationProvider>
                                </FormControl>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                                <FormControl>
                                    <FormLabel htmlFor="value">Image</FormLabel>
                                    <OutlinedInput
                                        type='text'
                                        value={formData.fileInfo ? formData.fileInfo.name : ""}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleImage}
                                                    edge="end"
                                                >
                                                    <ImageIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Image"
                                        slotProps={{
                                            input: {
                                                readOnly: true,
                                            },
                                        }}
                                    />
                                </FormControl>
                            </Grid2>

                            <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                <FormControl>
                                    <FormLabel htmlFor="alpha_code">Alpha Code</FormLabel>
                                    <Autocomplete
                                        multiple
                                        id="alpha_code"
                                        options={['All', ...alphaCodes]} // Add 'All' option
                                        defaultValue={formData.alpha_code}
                                        // freeSolo
                                        disableCloseOnSelect
                                        getOptionLabel={(option) => option}
                                        value={formData.alpha_code}
                                        onChange={(event, newValue, reason) => {
                                            const isAllSelected = newValue.includes('All');
                                            const isCurrentlyAll = formData.alpha_code.length === alphaCodes.length;

                                            if (isAllSelected) {
                                                // Toggle behavior
                                                setData((prevData) => ({
                                                    ...prevData,
                                                    alpha_code: isCurrentlyAll ? [] : alphaCodes,
                                                }));
                                            } else {
                                                setData((prevData) => ({
                                                    ...prevData,
                                                    alpha_code: newValue.filter((val) => val !== 'All'),
                                                }));
                                            }
                                        }}
                                        renderOption={(props, option, { selected }) => {
                                            const isAllOption = option === 'All';
                                            const isAllSelected = formData.alpha_code.length === alphaCodes.length;

                                            return (
                                                <li {...props}>
                                                    <Checkbox
                                                        style={{ marginRight: 8 }}
                                                        checked={isAllOption ? isAllSelected : selected}
                                                    />
                                                    <ListItemText primary={option} />
                                                </li>
                                            );
                                        }}
                                        renderTags={(value: readonly string[], getTagProps) =>
                                            value.map((option: string, index: number) => (
                                                <Chip
                                                    variant="outlined"
                                                    label={option}
                                                    {...getTagProps({ index })}
                                                />
                                            ))
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                name="alpha_code"
                                            // placeholder="e.g. GB, G20, RH"
                                            />
                                        )}
                                        sx={{
                                            '& .MuiInputBase-root': {
                                                height: 'auto',
                                            },
                                        }}
                                    />
                                    {/* <Select
                                        sx={{
                                            backgroundColor: "white !important",
                                            '& .MuiSelect-select': { display: "block !important" }
                                        }}
                                        id="alpha_code"
                                        multiple
                                        type="text"
                                        name="alpha_code"
                                        placeholder="i.e GB, G20, RH"
                                        autoFocus
                                        required
                                        fullWidth
                                        value={formData.alpha_code}
                                        onChange={(event) => handleInputChange(event)}
                                        variant="outlined"
                                        slotProps={{
                                            input: {
                                                readOnly: dialog_type === 'View',
                                            },
                                        }}
                                        renderValue={(selected) => {
                                            return selected.join(', ')
                                        }}
                                        MenuProps={MenuProps}
                                    >
                                        {alphaCodes.map((name) => (
                                            <MenuItem key={name} value={name}>
                                                <Checkbox checked={formData.alpha_code.includes(name)} />
                                                <ListItemText primary={name} />
                                            </MenuItem>
                                        ))}
                                    </Select> */}
                                </FormControl>
                            </Grid2>
                            {
                                dialog_type === 'View' ? (
                                    <>
                                        <Box sx={{

                                            width: "100%",
                                            marginTop: "10px",
                                        }}>
                                            <Tabs centered value={tabValue} onChange={handleTabChange} aria-label="tab">
                                                <Tab label="Prizes" {...a11yProps(0)} />
                                                <Tab label="Participants" {...a11yProps(1)} />
                                            </Tabs>
                                        </Box>
                                        <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} sx={{ marginTop: "10px" }}>

                                            <CustomTabPanel value={tabValue} index={0}>
                                                <CustomizedDataGridBasic
                                                    sx={{
                                                        width: "100%",
                                                    }}
                                                    data={selectedPrize}
                                                    headers={columnHeader}
                                                    pagination={paginationModel}
                                                    checkboxSelection={false}
                                                />
                                            </CustomTabPanel>
                                            <CustomTabPanel value={tabValue} index={1}>
                                                <Grid2
                                                    container
                                                    spacing={2}
                                                    columns={12}
                                                    sx={{ marginBottom: '10px' }}
                                                >
                                                    <Grid2 size={{ xs: 12, sm: 12, lg: 12 }}>
                                                        <Button
                                                            sx={{
                                                                float: "right",
                                                            }}
                                                            variant="outlined"
                                                            onClick={handleExport}
                                                        >
                                                            Export
                                                        </Button>
                                                    </Grid2>
                                                </Grid2>
                                                <Participants raffle_schedule_id={data.raffleSchedule[0].id} />
                                            </CustomTabPanel>
                                        </Grid2>
                                    </>
                                ) : (
                                    <>
                                        <Box sx={{
                                            display: "flex",
                                            justifyContent: "end",
                                            width: "100%",
                                            marginTop: "10px",
                                        }}>
                                            <Button
                                                variant="contained"
                                                onClick={handleOpenPrizeListDialog}
                                            >
                                                {dialog_type} Prizes
                                            </Button>
                                        </Box>


                                        <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} sx={{ marginTop: "10px" }}>
                                            <CustomizedDataGridBasic
                                                sx={{
                                                    width: "100%",
                                                }}
                                                data={selectedPrize}
                                                headers={columnHeader}
                                                pagination={paginationModel}
                                                checkboxSelection={false}
                                            />
                                        </Grid2>
                                    </>
                                )
                            }


                            {/* <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                                <FormControl>
                                    <FormLabel htmlFor="schedule_type">Prize Name</FormLabel>
                                    <TextField
                                        select
                                        id="prize_id"
                                        type="text"
                                        name="prize_id"
                                        autoComplete="prize_id"
                                        autoFocus
                                        required
                                        fullWidth
                                        variant="outlined"
                                        value={formData.prize_id ?? ""}
                                        onChange={handlePrizeNameChange}
                                        slotProps={{
                                            input: {
                                                readOnly: dialog_type === 'View',
                                            },
                                        }}

                                    >
                                        {
                                            prize_List?.list.length > 0 ? prize_List.list.map((x) => (

                                                <MenuItem key={x.id} value={x.id?.toString()}>{x.name}</MenuItem>

                                            )) : null
                                        }
                                    </TextField>
                                </FormControl>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                                <FormControl>
                                    <FormLabel htmlFor="details">Amount</FormLabel>
                                    <TextField
                                        id="amount"
                                        type="number"
                                        name="amount"
                                        placeholder=""
                                        autoComplete="amount"
                                        autoFocus
                                        required
                                        fullWidth
                                        value={formData.amount}
                                        variant="outlined"
                                        slotProps={{
                                            input: {
                                                readOnly: true,
                                            },
                                        }}
                                    />
                                </FormControl>
                            </Grid2> */}
                            {/* {
                                formData.schedule_type !== 1 ? (
                                    <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                                        <FormControl>
                                            <FormLabel htmlFor="value">End Date</FormLabel>
                                            <LocalizationProvider name="starting_date" dateAdapter={AdapterMoment}>
                                                <DateTimePicker name="starting_date" onChange={(date) => handleInputChange(date, "starting_date")} // Pass name explicitly
                                                    value={formData.end_date ? moment(formData.end_date) : null} />
                                            </LocalizationProvider>
                                        </FormControl>
                                    </Grid2>
                                ) : null
                            } */}
                        </Grid2>
                        <PrizeListDialog selectedPrize={selectedPrize} open={openPrizeList} onClose={handleOnClosePrizeList} prizeList={prizeList} onSubmit={handlePrizeSubmit} />
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        {
                            dialog_type === 'View' ? null : (
                                <Button type="submit" disabled={submitting}>Submit</Button>
                            )
                        }
                    </DialogActions>
                </form>
            </Dialog >
            <ImageDrawer open={imageDrawer} onChoose={handleImageRow} onClose={handleImageDrawerClose} />

        </>
    )
}

export default MyDialog;