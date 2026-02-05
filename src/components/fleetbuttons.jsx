import React, { useContext, useEffect, useRef, useState } from 'react';
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Picker from './picker';
import NewFleet from './newfleet';
import UpdateFleet from './updatefleet';
import { MarkContext } from "./browseapp";
import { Popover, Typography } from '@mui/material';
import { getFleets, postScopedData } from '../util/api';
import { useAuth0 } from '@auth0/auth0-react';
import { fL } from '../util/THCF';

export default function FleetButtons({
    onSelectionChange = () => console.log('fleet selection change'),
    onFleetsUpdated = () => console.log('fleet definitions change'),
    filters,
    filtered,
    fleets,
    fleetName,
}) {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const buttonRef = useRef();
    const [anchorEl, setAnchorEl] = useState();
    const markList = useContext(MarkContext);
    const { getAccessTokenSilently, user } = useAuth0();
    const id = user?.["https://oga.org.uk/id"];

    function onFleetChange(id, value) {
        if (value) {
            onSelectionChange(value);
        } else {
            onSelectionChange();
        }
    };

    useEffect(() => {
        const getData = async (accessToken) => {
            const f = await getFleets('public', { public: true }, accessToken);
            if (id) {
                const q = await getFleets('member', { owner_gold_id: id }, accessToken);
                f.push(...q);
            }
            return f;
        }
        if (!fleets) {
            getAccessTokenSilently()
                .then((accessToken) => {
                    getData(accessToken).then((data) => {
                        console.log('got fleets');
                        onFleetsUpdated(data);
                    }).catch((e) => {
                        console.error('Error fetching fleets:', e);
                    });
                }).catch((e) => {
                    console.error('Error getting access token for fleets:', e);
                });
        }
    }, [getAccessTokenSilently, fleets, user])

    const addOrUpdateFleet = (fleet, type) => {
        setAnchorEl(buttonRef.current);
        setPopoverOpen(true);
        getAccessTokenSilently()
        .then(async (accessToken) => {
            const scope = fleet.public ? 'public' : 'member';
            const response = await postScopedData(scope, 'fleets', fleet, accessToken);
            if (response.ok) {
                setPopoverOpen(false);
                // add or update the fleet in the list using the owner_gold_id and name as the key
                const of = Object.fromEntries(fleets.map(f => [`${f.owner_gold_id}:${f.name}`, f]));
                of[`${fleet.owner_gold_id}:${fleet.name}`] = fleet;
                onFleetsUpdated(Object.values(of), type);
            } else {
                console.error('Error updating fleet:', response);
                setPopoverOpen(false);
            }
        }).catch((e) => {
            console.error('Error getting access token for fleet update:', e);
            setPopoverOpen(false);
        });
    }
    return (
        <Stack direction='row' spacing={3}>
            <Typography ref={buttonRef} variant='h6' align='center' sx={{ pt: 1 }}> </Typography>
            <Box width={'10em'}>
                <Picker
                    onChange={onFleetChange}
                    id="fleet"
                    options={fleets}
                    label="Fleet"
                    value={fleetName||''}
                />
            </Box>
            <NewFleet
                markList={markList}
                filters={filters}
                selected={fleetName}
                onSubmit={addOrUpdateFleet}
                filtered={filtered}
                id={id}
            />
            <UpdateFleet
                markList={markList}
                fleet={fleets?.find((f) => f?.name === fleetName)}
                onSubmit={addOrUpdateFleet}
                id={id}
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
        </Stack>
    );
}
