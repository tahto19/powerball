import { Box, TextField, MenuItem, Button, FormLabel, Grid2, FormHelperText } from '@mui/material';
import { InquiryState, initialData } from './interface';
import MuiFormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import PhoneInput, { CountryData } from "react-phone-input-2";
import { useMediaQuery, useTheme } from "@mui/material";
import { toast } from "react-toastify";
import { getMessage } from "@/utils/util";
import apiService from "@/services/apiService";

const FormControl = styled(MuiFormControl)(({ theme }) => ({
    width: "100%"
}));
const Inquiry = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const [phoneError, setPhoneError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [formData, setData] = useState<InquiryState>(initialData);
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FocusEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        let tId = toast("Sending", {
            isLoading: true,
            hideProgressBar: false,
        });
        try {
            let res;

            res = await apiService.postInquiry(formData);

            const d = res

            if (d && d.success === 'success') {
                toast.update(tId, {
                    type: "success",
                    render: "Inquiry send successfully",
                    isLoading: false,
                    hideProgressBar: true,
                });
                // dispatch(showToaster({
                //     message: message,
                //     show: true,
                //     variant: "success",
                //     icon: null,
                // }))
                setData(initialData);
            } else {
                setSubmitting(false);
                toast.update(tId, {
                    type: "error",
                    render: d.message,
                    isLoading: false,
                    hideProgressBar: true,
                });
            }
        } catch (err) {
            setSubmitting(false);
            let message = getMessage(err);
            toast.update(tId, {
                type: "error",
                render: message,
                isLoading: false,
                hideProgressBar: true,
            });
            return false;
        }
    }
    return (
        <>
            <Box sx={{ padding: '10px', fontFamily: 'inherit' }}>
                <form onSubmit={handleSubmit}>

                    <Grid2
                        container
                        spacing={2}
                        columns={12}
                    >
                        <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                            <FormControl>
                                <FormLabel sx={{ fontFamily: 'inherit' }} htmlFor="name">Name</FormLabel>
                                <TextField
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="John"
                                    autoComplete="name"
                                    autoFocus
                                    required
                                    fullWidth
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    size="small"
                                />
                            </FormControl>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                            <FormControl>
                                <FormLabel sx={{ fontFamily: 'inherit' }} htmlFor="email">Email</FormLabel>
                                <TextField
                                    id="email"
                                    type="text"
                                    name="email"
                                    placeholder="sample@email.com"
                                    autoComplete="email"
                                    autoFocus
                                    required
                                    fullWidth
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    size="small"
                                />
                            </FormControl>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                            <FormControl>
                                <FormLabel sx={{ fontFamily: 'inherit' }} htmlFor="mobileNumber">Number</FormLabel>
                                <PhoneInput
                                    value={formData.mobileNumber}
                                    country={"ph"}
                                    onChange={(phone) =>
                                        setData((prev) => ({
                                            ...prev,
                                            mobileNumber: phone,
                                        }))
                                    }
                                    inputStyle={{
                                        border: "1px solid #c4c4c4",
                                        height: "100%",
                                        width: "100%",
                                        minHeight: "40px",
                                    }}
                                    inputProps={{
                                        name: "phone",
                                        required: true,
                                        autoFocus: true,
                                    }}
                                    onBlur={(phone, e: CountryData) => {
                                        const mobileNumber = phone.target.value.replace(
                                            /[+\s]/g,
                                            ""
                                        ).length;
                                        const totalLength = e.format.replace(/[+\s]/g, "").length;
                                        if (totalLength - 1 > mobileNumber || mobileNumber <= 2) {
                                            setPhoneError("Invalid mobile number");
                                        } else {
                                            setPhoneError("");
                                        }
                                    }}
                                />
                                {phoneError && (
                                    <FormHelperText sx={{ color: 'red' }}>
                                        {phoneError}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                            <FormControl>
                                <FormLabel sx={{ fontFamily: 'inherit' }} htmlFor="message">Message</FormLabel>
                                <TextField
                                    id="message"
                                    type="string"
                                    name="message"
                                    placeholder="Insert text here..."
                                    autoComplete="message"
                                    autoFocus
                                    required
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleInputChange}
                                />
                            </FormControl>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 12, lg: 12 }}>
                            <Button size="large" sx={{ width: '100%', backgroundColor: '#37368e' }} variant="contained" type="submit" disabled={submitting}>Send</Button>
                        </Grid2>
                    </Grid2>
                </form>
            </Box>
        </>
    )
}

export default Inquiry;