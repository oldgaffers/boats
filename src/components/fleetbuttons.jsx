import React, { useContext, useState, useEffect } from 'react';
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth0 } from '@auth0/auth0-react';
import { TokenContext } from './TokenProvider';
import { getScopedData } from './boatregisterposts';
import Picker from './picker';
import NewFleet from './newfleet';
import AddToFleet from './addtofleet';
import { MarkContext } from "../browseapp";

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
            const fleets = p?.data?.Items||[];
            (q?.data?.Items||[]).forEach(element => {
                if (!fleets.find((f) => f.name === element.name)) {
                    fleets.push(element);
                }
            });
            fleets.sort((a,b) => ((a.owner_gold_id === id)?1:2)*(a.name.localeCompare(b.name)||1));
            setItems(fleets);
        }
        if (accessToken && !items) {
            getData();
        }
    }, [accessToken, items, id])

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
    return (
        <>
            <Picker
                onChange={onFleetChange}
                id="fleet"
                options={items}
                label="Fleet"
                value={selected}
            />
            <NewFleet markList={markList} />
            <AddToFleet markList={markList} fleet={selected} />
        </>
    );
}