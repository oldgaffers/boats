import { useState } from 'react';
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import OGA60 from "./oga60interest";

export default function OGA60Form() {
    const [snackBarOpen, setSnackBarOpen] = useState(false);

    const handleClose = () => {
        setSnackBarOpen(true);
    }
 
    const handleCancel = () => {
        // eslint-disable-next-line no-restricted-globals
        history.go(0);
    }

    const handleSnackBarClose = () => {
        setSnackBarOpen(false);
        // eslint-disable-next-line no-restricted-globals
        history.go(0);
    }

    return (
        <>
            <Grid container spacing={1}>
                <Grid xs={12}>&nbsp;</Grid>
                <Grid xs={1}>&nbsp;</Grid>
                <Grid xs={10}><OGA60 onClose={handleClose} onCancel={handleCancel} /></Grid>
                <Grid xs={1}>&nbsp;</Grid>
                <Grid xs={12}>&nbsp;</Grid>
            </Grid>
            <Snackbar
                sx={{ backgroundColor: 'green' }}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={snackBarOpen}
                autoHideDuration={5000}
                onClose={handleSnackBarClose}
                message="Thanks for your interest. You should receive an email to say we have your details."
                severity="success"
            />
        </>
    );
}
