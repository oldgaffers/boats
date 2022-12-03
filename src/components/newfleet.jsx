import React, { useEffect, useState } from "react";
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
import Snackbar from '@mui/material/Snackbar';
import RoleRestricted from './rolerestrictedcomponent';

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
                <Button onClick={handleClose}>Create</Button>
            </DialogActions>
        </Dialog>
    );
}

export default function NewFleet({ markList }) {
    const [open, setOpen] = useState(false);
    const [snackBarOpen, setSnackBarOpen] = useState(false);
 
    useEffect(() => {
        console.log('NewFleet TODO');
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const addFleet = (name, isPublic) => {
        console.log('addFleet', name, isPublic);
    } 

    const handleClose = (value) => {
        setOpen(false);
        addFleet(value.name, value.public);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleSnackBarClose = () => {
        setSnackBarOpen(false);
    }

    console.log('NewFleet', markList);

    if (markList?.length === 0) {
        return '';
    }

    return (
        <RoleRestricted role='member'>
            <Button
                size="small"
                variant="contained"
                color='primary'
                onClick={handleClickOpen}
            >Create New Fleet from Marked</Button>
            <CreateFleetDialog
                ogaNos={markList}
                open={open}
                onCancel={handleCancel}
                onClose={handleClose}
            />
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={snackBarOpen}
                autoHideDuration={2000}
                onClose={handleSnackBarClose}
                message="Fleet created."
                severity="success"
            />
        </RoleRestricted>
    );
}