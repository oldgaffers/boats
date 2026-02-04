import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import { FormControl, Radio, RadioGroup } from "@mui/material";

function CreateFleetDialog({
    onCancel, onClose, open, filterCount, markedBoatCount,
}) {
    const [name, setName] = useState('');
    const [pub, setPub] = useState(false);
    const [type, setType] = useState((markedBoatCount===0)?"static":"marked");

    const handleCancel = () => {
        onCancel();
    };

    const handleClose = () => {
        onClose({ name, public: pub, type });
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Create Fleet</DialogTitle>
            <DialogContent>
                <FormControl>
                    <RadioGroup
                        aria-labelledby="fleet-type"
                        value={type}
                        name="radio-buttons-group"
                        onChange={(event) => setType(event.target.value)}
                    >
                        <FormControlLabel value="dynamic" control={<Radio disabled={filterCount===0}/>} label="New Fleet from filter - new matching boats are automatically added" />
                        <FormControlLabel value="static" control={<Radio disabled={filterCount===0}/>} label="New Fleet from the boats currently visible" />
                        <FormControlLabel value="marked" control={<Radio disabled={markedBoatCount===0}/>} label={`New Fleet from ${markedBoatCount} marked boats`} />
                    </RadioGroup>
                </FormControl>
                <Stack spacing={2} direction="row">
                    <TextField onChange={(event) => setName(event.target.value)} id="name" label="Name" variant="outlined" />
                    <FormControlLabel control={<Switch onChange={(event) => setPub(event.target.checked)} />} label="Public" />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button color='primary' onClick={handleClose}>Create</Button>
            </DialogActions>
        </Dialog>
    );
}

export default function NewFleet({
    onSubmit,
    markList = [],
    selected,
    filters={},
    filtered,
    id,
}) {
    const [open, setOpen] = useState(false);

    const handleClose = (value) => {
        setOpen(false);
        const data = {
            name: value.name,
            owner_gold_id: id,
            public: value.public,
            created_at: (new Date()).toISOString(),
        };
        switch (value.type) {
            case 'dynamic':
                console.log('D', filters);
                data.filters = filters;
                break;
            case 'static':
                {
                    const ogaNos = filtered.map((boat) => boat.oga_no);
                    data.filters = { oga_nos: ogaNos };
                }
                break;
            default:
                data.filters = { oga_nos: markList };
        }
        onSubmit(data);
    };

    if (selected) {
        return '';
    }

    const markedBoatCount = markList?.length || 0;
    const filterCount = Object.keys(filters).length;

    if (( markedBoatCount === 0) && (filterCount === 0)) {
        return '';
    }

    return (
        <>
            <Button
                size="small"
                variant="contained"
                color='primary'
                onClick={() => setOpen(true)}
            >New Fleet</Button>
            <CreateFleetDialog
                markedBoatCount={markedBoatCount}
                filterCount={filterCount}
                open={open}
                onCancel={() => setOpen(false)}
                onClose={handleClose}
            />
        </>
    );
}