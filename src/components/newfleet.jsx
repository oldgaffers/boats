import React, { useContext, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import { useAuth0 } from "@auth0/auth0-react";
import { Popover, Typography } from "@mui/material";
import { postScopedData } from "./boatregisterposts";
import { TokenContext } from './TokenProvider';

function CreateFleetDialog({
    onCancel, onClose, open
}) {
    const [name, setName] = useState('');
    const [pub, setPub] = useState(false);

    const handleCancel = () => {
        onCancel();
    };

    const handleClose = () => {
        onClose({ name, public: pub });
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleSwitchChange = (event) => {
        setPub(event.target.checked);
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Create Fleet</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Name and create a personal fleet.
                </DialogContentText>
                <Stack spacing={2} direction="row">
                    <TextField onChange={handleNameChange} id="name" label="Name" variant="outlined" />
                    <FormControlLabel control={<Switch onChange={handleSwitchChange} />} label="Public" />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button color='primary' onClick={handleClose}>Create</Button>
            </DialogActions>
        </Dialog>
    );
}

export default function NewFleet({ markList = [], updated=()=>console.log('updated') }) {
    const { user } = useAuth0();
    const id = user?.["https://oga.org.uk/id"];
    const accessToken = useContext(TokenContext);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState();
    const [open, setOpen] = useState(false);
    const buttonRef = useRef();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const addFleet = (name, isPublic) => {
        console.log('addFleet', name, isPublic, markList);
        const data = {
            name,
            owner_gold_id: id,
            public: isPublic,
            filters: { oga_nos: markList },
            created_at: (new Date()).toISOString(),
        };
        const scope = (isPublic)? 'public' : 'member';
        postScopedData(scope, 'fleets', data, accessToken)
        .then(() => {
            setPopoverOpen(false);
            updated();
        })
        .catch((e) => {
            console.log(e);
            setPopoverOpen(false);
        });
    }

    const handleClose = (value) => {
        setOpen(false);
        setAnchorEl(buttonRef.current);
        setPopoverOpen(true);
        addFleet(value.name, value.public);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    if (markList?.length === 0) {
        return '';
    }

    return (
        <>
            <Button
                ref={buttonRef}
                size="small"
                variant="contained"
                color='primary'
                onClick={handleClickOpen}
            >New Fleet from {markList.length} Marked</Button>
            <CreateFleetDialog
                ogaNos={markList}
                open={open}
                onCancel={handleCancel}
                onClose={handleClose}
            />
            <Popover
                open={popoverOpen}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(undefined)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Typography sx={{ p: 2 }}>posting request</Typography>
            </Popover>
        </>
    );
}