import React, { useContext, useState, useEffect } from 'react';
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Picker from './picker';
import NewFleet from './newfleet';
import UpdateFleet from './updatefleet';
import { MarkContext } from "./browseapp";

export default function FleetButtons({
    onSelectionChange = () => console.log('fleet selection change'),
    onFleetsUpdated = ()=> console.log('fleet definitions change'),
    filters,
    filtered,
    fleets,
    fleetName,
}) {
    const markList = useContext(MarkContext);

    function onFleetChange(id, value) {
        if (value) {
            onSelectionChange(value);
        } else {
            onSelectionChange();
        }
    };

    function fleetsUpdated() {
        setItems(undefined);
    }

    return (
        <Stack direction='row' spacing={3}>
            <Box width={'10em'}>
                <Picker
                    onChange={onFleetChange}
                    id="fleet"
                    options={fleets}
                    label="Fleet"
                    value={fleetName}
                />
            </Box>
            <NewFleet markList={markList} filters={filters} selected={fleetName} updated={fleetsUpdated} filtered={filtered} />
            <UpdateFleet
                markList={markList}
                fleet={fleets.find((f) => f.name === fleetName)}
                updated={onFleetsUpdated}
            />
        </Stack>
    );
}
