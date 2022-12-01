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
import { useAuth0 } from "@auth0/auth0-react";
import { gql, useMutation } from "@apollo/client";
import Snackbar from '@mui/material/Snackbar';

const ADD_FLEET = gql`mutation addfleet($owner_gold_id: Int = 10, $filters: jsonb = "", $name: String = "", $public: Boolean = false) {
  insert_fleet(objects: {name: $name, owner_gold_id: $owner_gold_id, public: $public, filters: $filters}) {
    returning {
      name
      id
    }
  }
}`;

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
    const { user, isAuthenticated } = useAuth0();
    const [open, setOpen] = useState(false);
    const [complete, setComplete] = useState(false);
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [addFleet, addFleetResult] = useMutation(ADD_FLEET);

    useEffect(() => {
        const { data, loading, error, called } = addFleetResult;
        if (called) {
            if (loading) {
                // console.log('still loading');
            } else {
                if (error) {
                    console.log('error submitting a change', error);
                } else {
                    if (complete) {
                        // console.log('complete');
                    } else {
                        console.log(`successfully submitted ${data.insert_boat_pending_updates.affected_rows} changes`);
                        setSnackBarOpen(true);
                        setComplete(true);
                    }
                }
            }
        } else {
            // console.log('idle');
        }
    }, [addFleetResult, complete]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
        addFleet({
            variables: {
                owner_gold_id: user["https://oga.org.uk/id"],
                filters: { oga_nos: markList },
                name: value.name,
                public: value.public
            }
        });
    };

    const handleCancel = () => {
        setOpen(false);
    };


    const handleSnackBarClose = () => {
        setSnackBarOpen(false);
    }

    if (!isAuthenticated) {
        return '';
    }

    if (markList?.length === 0) {
        return '';
    }

    return (
        <>
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
        </>
    );
}