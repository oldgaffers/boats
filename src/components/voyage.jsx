import React, { useState } from 'react';
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useAuth0 } from "@auth0/auth0-react";
import VoyageMap from './voyagemap';
import Disclaimer from './Disclaimer';
import { postGeneralEnquiry } from '../util/api';

function interestEmail(from, fromEmail, user, voyage) {

    const contact = `${from} <${fromEmail}>`;

    if (user) {
        return {
            to: [voyage.organiserEmail],
            cc: [contact],
            subject: `Crewing interest from an OGA Member for your ${voyage.title}`,
            message: `Hello from the OGA,
OGA Member ${from} has expressed interest in your voyage.
They can be contacted with a 'reply all' to this email.
If they have a crewing profile you will find it in the membership area.
Their OGA Membership number is ${user['https://oga.org.uk/member']}`,
        };
    }
    return {
        to: [voyage.organiserEmail],
        subject: `Crewing interest for your ${voyage.title}`,
        message: `Hello from the OGA,
Someone viewing the Boat Register has expressed interest in your voyage.
They can be contacted by email at ${contact}.`,
    };
}

function EntryFields({ from, fromEmail, onChangeName, onChangeEmail }) {
    if (from && fromEmail) {
        return '';
    }
    return <Stack direction='column'>
        <TextField
            onChange={(e) => onChangeEmail(e.target.value)}
            margin="dense"
            label="Your Email"
            type="text"
            value={fromEmail}
        />
        <TextField
            onChange={(e) => onChangeName(e.target.value)}
            margin="dense"
            label="Your Name"
            type="text"
            value={from}
        />
    </Stack>;

}

function InterestDialog({ from, fromEmail, open, onSubmit, onCancel, voyage }) {
    const [name, setName] = useState(from);
    const [email, setEmail] = useState(fromEmail);
    const [oldEnough, setOldEnough] = useState(false);

    const bad =  (!oldEnough) || name ===  undefined || name.trim() === '' || email === undefined || !email.includes('@')

    return <Dialog open={open}>
        <DialogTitle>{voyage.title} on {voyage.boat.name} ({voyage.boat.oga_no})</DialogTitle>
        <DialogContent>
            <EntryFields from={name} fromEmail={email} onChangeEmail={setEmail} onChangeName={setName} />
            <DialogContentText>
                <Disclaimer />
                Would you like us to email the organiser and ask them to contact you?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <FormControlLabel
                control={<Checkbox
                    checked={oldEnough}
                    onChange={(e) => setOldEnough(e.target.checked)}
                />}
                label="I confirm I am over 18 years old"
            />
            <Button disabled={bad} onClick={() => onSubmit(name, email)}>Yes</Button>
            <Button onClick={onCancel}>No</Button>
        </DialogActions>
    </Dialog>;
}

export default function Voyage({ voyage }) {
    const [open, setOpen] = useState(false);
    const [snackBarOpen, setSnackBarOpen] = useState(false);

    const title = `${voyage.title} on ${voyage.boat.name} (${voyage.boat.oga_no})`;

    const { user } = useAuth0();

    function handleSubmit(from, fromEmail) {
        console.log(from, fromEmail);
        setOpen(false);
        const data = interestEmail(from, fromEmail, user, voyage);
        postGeneralEnquiry('public', 'contact', data)
            .then((response) => {
                setSnackBarOpen(true);
            })
            .catch((error) => {
                console.log("post", error);
                // TODO snackbar from response.data
            });
    }

    if (voyage) {
        return <Card>
            <CardHeader title={title} />
            <CardMedia>{(voyage.places?.length > 0) ? <VoyageMap places={voyage.places} /> : ''}</CardMedia>
            <CardContent>
                <Typography>Skippered by {voyage.skipper}</Typography>
                <Typography>Between {voyage.start} and {voyage.end}</Typography>
                <Typography>Type: {voyage.type}</Typography>
                <Typography>Covering around {voyage.distance} nm</Typography>
                <Typography
                    component='div'
                    dangerouslySetInnerHTML={{ __html: voyage?.specifics?.trim()  }}
                ></Typography>
            </CardContent>
            <CardActions>
                <Button onClick={() => setOpen(true)}>I'm Interested</Button>
            </CardActions>
            <InterestDialog
              voyage={voyage}
              from={user?.name} fromEmail={user?.email}
              open={open} onSubmit={handleSubmit} onCancel={() => setOpen(false)}
            />
            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                open={snackBarOpen}
                autoHideDuration={2000}
                onClose={() => setSnackBarOpen(false)}
            >
                <Alert severity="success">Thanks, we've let them know.</Alert>
            </Snackbar>
        </Card>;
    }
    return "nothing to see here";
}

function skipperIfDifferent(skipper, organiser) {
    if (skipper === organiser) {
        return 'I will be the skipper';
    }
    return `
The skipper will be ${skipper}.`;
}

export function voyageInvitationBody(voyage, organiser, from) {
    return `Hello,
I am planning a trip on ${voyage.boat.name} (${voyage.boat.oga_no}) between the dates ${voyage.start} and ${voyage.end}.

The details are:

${skipperIfDifferent(voyage.skipper, organiser)}
Title: ${voyage.title}
Type: ${voyage.type}
Covering around ${voyage.distance} nm

${voyage.specifics}

If you are interested in joining me, please email me at the address below.

You can find these details, together with other OGA member's voyages at:
https://oga.org.uk/members_area/find_a_spot_on_a_boat/find_a_spot_on_a_boat.html.

Looking forward to hearing from you.

${organiser}
${from}
`;
}