import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import SendIcon from "@mui/icons-material/Send";
import MailIcon from "@mui/icons-material/Mail";
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Stack, Tooltip, Typography } from "@mui/material";
import { getIsMember, postGeneralEnquiry } from '../util/api';
import LoginButton from './loginbutton';

function ContactDialog({
    open,
    onSend,
    onCancel,
    title,
}) {

    const onClickSend = () => {
        onSend();
    }

    return (
        <Dialog
            open={open}
            onClose={() => onCancel()}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText variant="subtitle2">
                    We'll email the administrators and they will contact you
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onCancel()} color="primary">
                    Cancel
                </Button>
                <Button
                    endIcon={<SendIcon />}
                    onClick={onClickSend}
                    color="primary"
                >
                    Send
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function Contact() {
    const [open, setOpen] = useState(false);
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const { user, getAccessTokenSilently } = useAuth0();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    function handleSnackBarClose() {
        setSnackBarOpen(false);
    }

    const handleSend = () => {
        setOpen(false);
        const data = {
            subject: 'associate login with membership',
        };
        if (user) {
            data.cc = [user.email]
            data.to = ['boatregister@oga.org.uk']
            data.message = `The person with the login details below has requested that their account
            be associated with an OGA membership.
        
            If this was you, you should get an email from an OGA officer.
        ${Object.entries(user).map(([k, v]) => `${k}: ${v}`).join('\n')}`;
        }
        getAccessTokenSilently().then((token) => {
            postGeneralEnquiry('public', 'associate', data, token)
                .then((response) => {
                    console.log(response)
                    setSnackBarOpen(true);
                })
                .catch((error) => {
                    console.log("post", error);
                    // TODO snackbar from response.data
                });
        });
    };

    return (
        <>
            <Button sx={{ maxWidth: 500 }}
                size="small"
                endIcon={<MailIcon />}
                variant="contained"
                color="success"
                onClick={handleClickOpen}
            >
                Please associate my login with my membership
            </Button>
            <ContactDialog
                open={open}
                onCancel={handleCancel}
                onSend={handleSend}
                title='Associate login with Membership'
            />
            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                open={snackBarOpen}
                autoHideDuration={2000}
                onClose={handleSnackBarClose}
            >
                <Alert severity="success">Thanks, we've forwarded your message by email.</Alert>
            </Snackbar>
        </>
    );
}

export default function CheckMembership() {
    const { user, getAccessTokenSilently } = useAuth0();
    const [found, setFound] = useState();
    useEffect(() => {
        if (!found) {
            getAccessTokenSilently().then((accessToken) => {
                getIsMember(user.email, accessToken).then((data) => {
                    setFound(data);
                });
            });
        }
    }, [user.email, found]);

    if (!found) {
        return (
            <Stack direction="row" spacing={2} alignItems="center">
                <CircularProgress />
                <Typography>Please wait while we check</Typography>
            </Stack>
        );
    }
    if (found.email) {
        return (
            <>
                <Typography variant="body1">
                    Good news! We have found your membership record.
                    We are currently updating our records to link your login with your membership.
                    Please log out and log in again
                    <Box fontWeight='fontWeightBold' display='inline'> in a few minutes </Box>
                    to refresh your account.
                </Typography >
            </>
        );
    }
    return (
        <>
            <Typography>
                Sorry, we have checked and we couldn't find a membership record for you.
            </Typography>
            <Typography>
                This could be that our records are in error, or that you used different email addresses when you joined and when you created a login.
                Click the button below and we'll contact you to sort it out.
            </Typography>
            <Contact />
            <Box maxWidth={100}>
                <LoginButton />
            </Box>
        </>
    );
}
