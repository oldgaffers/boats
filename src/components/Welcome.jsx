import { useState } from "react";
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
    const { user } = useAuth0();

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
        const data: any = {
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
        postGeneralEnquiry('public', 'associate', data)
            .then((response) => {
                console.log(response)
                setSnackBarOpen(true);
            })
            .catch((error) => {
                console.log("post", error);
                // TODO snackbar from response.data
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
                <LoginButton />
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
                Sorry {user.given_name}, we can't associate your login with a member.
                When you create a login, the system matches your email address with the one we have on record.
                If you used the same one, it just works. If you use a different one we need to make the association for you.
            </Typography>
            <Typography component='div'>
                <ul>
                    <li>If you've recently joined the OGA, it might be just that our systems haven't caught up yet:</li>
                    <ul>
                        <li>Please wait until at least the morning after you received your membership number.</li>
                    </ul>
                    <li>If you've just created your login:</li>
                    <ul>
                        <li>Try logging out and back in again. Sometimes it just takes a little while</li>
                        <li>If you might have used a different email address then click the button below and we'll contact you to sort it out.</li>
                    </ul>
                </ul>
            </Typography>
            <Contact />
            <Box maxWidth={100}>
                <LoginButton />
            </Box>
        </Stack>
    );
}
