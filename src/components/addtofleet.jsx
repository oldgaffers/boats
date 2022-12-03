import React from "react";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import RoleRestricted from './rolerestrictedcomponent';

export default function AddToFleet({ markList }) {
    console.log('AddToFleet TODO');

    function handleChangeFleet(event) {
        console.log('handleChangeFleet', event);
    }

    if (markList?.length === 0) {
        return '';
    }

    const fleets = [];

    if (fleets.length === 0) {
        return '';
    }

    return (
        <RoleRestricted role='member'>
            <Stack direction="row" spacing={2}>
                <FormControl fullWidth={true}>
                    <InputLabel id="fleet">Fleet</InputLabel>
                    <Select
                        size="small"
                        labelId="fleet-label"
                        id="fleet"
                        label="Fleet"
                        onChange={handleChangeFleet}
                    >
                        {
                            fleets.map((fleet) =>
                                <MenuItem value={fleet.name}>{fleet.name}</MenuItem>
                            )
                        }
                    </Select>
                </FormControl><Button
                    size="small"
                    variant="contained"
                    color='primary'
                >Add Marked to Fleet</Button>
            </Stack>
        </RoleRestricted>
    );
}