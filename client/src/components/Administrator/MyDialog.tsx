//@ts-nocheck

import * as React from "react";
import { useState } from 'react'
import TextField from '@mui/material/TextField';
import { InputAdornment, IconButton, FormHelperText } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from "@mui/material/Button";
import MuiFormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import { DataProps } from "@/types/allTypes";
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { postAdmin } from "@/redux/reducers/user/asnycCalls";

interface MyDialogProps {
    open: boolean;
    data: DataProps;
    dialogType: string | null;
    onClose: (value: boolean) => void;
}



const FormControl = styled(MuiFormControl)(({ theme }) => ({
    width: "100%"
}));

const MyDialog = ({ open, data, dialogType, onClose }: MyDialogProps) => {
    // const [isOpen, setOpen] = React.useState(open);
    const { loading } = useAppSelector(s => s.user)
    const dispatch = useAppDispatch()
    const {
        getValues,
        register,
        handleSubmit,
        setValue,
        setError,
        clearErrors,
        reset,
        formState: { errors },
    } = useForm<DataProps>({
        mode: "onChange"
    });
    const [dialog_type, setDialogType] = React.useState("")
    const [formData, setData] = React.useState<DataProps>(data);
    const [showPassword, setShowPassword] = useState(false)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const resetValues = () => {
        let a = getValues()
        let b = {}
        Object.keys(a).forEach(v => {
            b[v] = null
        })
        reset(b, {
            keepErrors: true,
            keepDirty: true,
        })
    }
    const handleClose = () => {
        onClose(false);
        // reset()
        resetValues()

    };

    React.useEffect(() => {
        setData(data)
        setDialogType(dialogType)

        if (dialogType?.toLowerCase() !== "add") {
            Object.keys(data).forEach((v) => {
                let val = v === 'password' ? '' : data[v]
                setValue(v, val, { shouldValidate: true, required: true })
            })
        }
    }, [data, dialogType])
    const onSubmit: SubmitHandler<DataProps> = (data) => {
        let isSend = { ...data, 'isAdmin': true }

        dispatch(postAdmin({ data: isSend, dialogType }))
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>{dialog_type} Administrator</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit(onSubmit)} id="my-form"></form>
                    <Grid
                        container
                        spacing={2}
                        columns={12}
                    >
                        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                            <FormControl>
                                <FormLabel htmlFor="first name">First Name</FormLabel>
                                <TextField
                                    id="firstName"
                                    type="text"
                                    name="first_name"
                                    placeholder="John"
                                    autoComplete="firstName"
                                    {...register("firstname", {
                                        required: true,
                                    })}
                                    autoFocus
                                    required
                                    fullWidth
                                    variant="outlined"
                                    slotProps={{
                                        input: {
                                            readOnly: dialog_type === 'View',
                                        },
                                    }}
                                />
                                {errors &&
                                    errors.firstname &&
                                    errors.firstname.type &&
                                    errors.firstname.type === "required" && (
                                        <FormHelperText sx={{ color: "red" }}>
                                            Required
                                        </FormHelperText>
                                    )}
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                            <FormControl>
                                <FormLabel htmlFor="last name">Last Name</FormLabel>
                                <TextField
                                    id="lastName"
                                    type="text"
                                    name="lastname"
                                    placeholder="Snow"
                                    autoComplete="lastname"
                                    autoFocus
                                    required
                                    fullWidth
                                    variant="outlined"
                                    {...register("lastname", { required: true })}

                                    slotProps={{
                                        input: {
                                            readOnly: dialog_type === 'View',
                                        },
                                    }}
                                />
                                {errors &&
                                    errors.lastname &&
                                    errors.lastname.type &&
                                    errors.lastname.type === "required" && (
                                        <FormHelperText sx={{ color: "red" }}>
                                            Required
                                        </FormHelperText>
                                    )}
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                            <FormControl>
                                <FormLabel htmlFor="mobile number">Mobile Number</FormLabel>
                                <TextField
                                    id="mobileNumber"
                                    type="text"
                                    name="mobile_number"
                                    placeholder="09123456789"
                                    autoComplete="mobile_number"
                                    autoFocus
                                    required
                                    fullWidth
                                    variant="outlined"
                                    {...register("mobileNumber", { required: true })}
                                    slotProps={{
                                        input: {
                                            readOnly: dialog_type === 'View',
                                        },
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                            <FormControl>
                                <FormLabel htmlFor="email">Email Address</FormLabel>
                                <TextField
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="your@email.com"
                                    autoComplete="email"
                                    autoFocus
                                    required
                                    fullWidth
                                    variant="outlined"

                                    {...register("emailAddress", {
                                        required: true,
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "invalid email address",
                                        },
                                    })}
                                    slotProps={{
                                        input: {
                                            readOnly: dialog_type === 'View',
                                        },
                                    }}
                                />
                            </FormControl>
                            {errors &&
                                errors.emailAddress &&
                                errors.emailAddress.type &&
                                errors.emailAddress.type === "required" && (
                                    <FormHelperText sx={{ color: "red" }}>
                                        Required
                                    </FormHelperText>
                                )}
                            {errors && errors.emailAddress && (
                                <FormHelperText sx={{ color: "red" }}>
                                    {errors.emailAddress.message}
                                </FormHelperText>
                            )}
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                            <FormControl>
                                <FormLabel htmlFor="password">Password</FormLabel>
                                <TextField
                                    name="password"
                                    placeholder="••••••"
                                    type={showPassword ? 'text' : "password"}
                                    id="password"
                                    autoComplete="current-password"
                                    autoFocus
                                    fullWidth
                                    variant="outlined"
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label={
                                                            showPassword
                                                                ? "hide the password"
                                                                : "display the password"
                                                        }
                                                        onClick={() => {
                                                            setShowPassword(!showPassword);
                                                        }}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    {...register("password", {
                                        required: dialog_type === 'add' ? true : false,
                                        minLength: {
                                            value: 6,
                                            message: "At least 6 characters required",
                                        },
                                        pattern: {
                                            value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/,
                                            message:
                                                "Must include uppercase, lowercase  number, and special character",
                                        },
                                    })}
                                    disabled={formData.id || dialog_type === 'View' ? true : false}
                                />
                            </FormControl>   {errors &&
                                errors.password &&
                                errors.password.type === "required" && (
                                    <FormHelperText sx={{ color: "red" }}>
                                        Required
                                    </FormHelperText>
                                )}
                            {errors &&
                                errors.password &&
                                errors.password.message &&
                                errors.password.message !== "" && (
                                    <FormHelperText sx={{ color: "red" }}>
                                        {errors.password.message}
                                    </FormHelperText>
                                )}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" form="my-form" loading={loading}>Submit</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default MyDialog;