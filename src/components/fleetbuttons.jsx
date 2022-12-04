import React, { useContext, useState, useEffect } from 'react';
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useAuth0 } from '@auth0/auth0-react';
import { getScopedData } from './boatregisterposts';
import Picker from './picker';
import NewFleet from './newfleet';
import UpdateFleet from './updatefleet';
import { TokenContext } from './TokenProvider';
import { MarkContext } from "../browseapp";

function sortFleets(sharedFleets, memberFleets, ) {
    const f1 = [...memberFleets];
    f1.sort((a,b) => a.name.localeCompare(b.name));
    const f2 = [...sharedFleets];
    f2.sort((a,b) => a.name.localeCompare(b.name));
    return [...f1, ...f2];
}

export default function FleetButtons({
    onChange=()=>{console.log('fleet change');},
}) {
    const [items, setItems] = useState();
    const [selected, setSelected] = useState();
    const markList = useContext(MarkContext);
    const accessToken = useContext(TokenContext);
    const { user } = useAuth0()
    const id = user?.["https://oga.org.uk/id"];

    useEffect(() => {
        const getData = async () => {
            const p = await getScopedData('member', 'fleets', {public: true}, accessToken);
            const q = await getScopedData('member', 'fleets', {owner_gold_id: id}, accessToken);
            setItems(sortFleets(p?.data?.Items||[], q?.data?.Items||[]));
        }
        if (accessToken && !items) {
            getData();
        }
    }, [accessToken, items, id])

    /*
    useEffect(() => {
        if (selected) {
            onChange(selected, items.find((item) => item.name === selected).filters);
        }
    }, [items, onChange, selected]);
    */

    if (accessToken && !items) {
        return <CircularProgress />;
    }

    function onFleetChange(id, value) {
        if (value) {
            onChange(value, items.find((item) => item.name === value).filters);
        } else {
            onChange(undefined, items?.find((item) => item?.name === selected)?.filters);
        }
        setSelected(value);
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
                    options={items}
                    label="Fleet"
                    value={selected}
                />
            </Box>
            {
                (markList.length > 0 && ! selected) ? <NewFleet markList={markList} updated={fleetsUpdated} /> : ''
            }            
            <UpdateFleet
                markList={markList}
                fleet={items.find((f) => f.name === selected)}
                updated={fleetsUpdated}
            />
        </Stack>
    );
}
