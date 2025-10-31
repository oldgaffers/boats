import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import SendIcon from "@mui/icons-material/Send";
import MailIcon from "@mui/icons-material/Mail";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Stack, Tooltip, Typography } from "@mui/material";
import { postGeneralEnquiry } from '../util/api';
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

export default function Welcome() {
    const { user } = useAuth0();
    if (!user) {
        return (
            <Tooltip title='If you are a member then please log-in to enable extra members only features.'>
                <Box><LoginButton /></Box>
            </Tooltip>
        );
    }
    if (user['https://oga.org.uk/id']) {
        return (
            <>
                <Typography variant="h6">Hi{' '}{user.name}.</Typography>
                <LoginButton />
            </>
        );
    }
    return (
        <Stack marginTop={2} spacing={1} maxWidth='50%'>
            <Typography>
                Sorry{user.given_name ? ` ${user.given_name}` : ''}, we didn't manage to associate your login with a member.
                If this is your first time logging in, and you used the same email for your login as the OGA has on
                record, then please log-out now and log straight back in again. If this doesn't work, don't worry.
                Just read on.
            </Typography>
            <Typography>
                When you create a login, the system matches your email address with the one we have on record.
                If you used the same one, the second time you log in, it almost always just works.
                If you use a different one we need to make the association for you.
            </Typography>
            <Typography>
                If you've tried logging out and back in again and you are still getting this message then click the button below and we'll contact you to sort it out.
            </Typography>
            <Contact />
            <Box maxWidth={100}>
                <LoginButton />
            </Box>
        </Stack>
    );
}
