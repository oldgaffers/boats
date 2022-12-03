import React, { useContext, useState, useEffect } from 'react';
import CircularProgress from "@mui/material/CircularProgress";

import { TokenContext } from './TokenProvider';
import { getScopedData } from './boatregisterposts';
import RoleRestricted from './rolerestrictedcomponent';
import Picker from './picker';
import NewFleet from './newfleet';
import AddToFleet from './addtofleet';

export function FleetPicker({ currentFilters={} }) {
    return (
        <RoleRestricted role='member'>
          <Picker
            onChange={()=>console.log('fleet change')}
            id="fleet"
            options={[{name: 'RBC 60'}]}
            label="Fleet"
            value={currentFilters["fleet"]}
          />
        </RoleRestricted>
    );
}

export default function FleetButtons({ markList }) {
    const [data, setData] = useState();
    const accessToken = useContext(TokenContext);

    useEffect(() => {
        const getData = async () => {
            const p = await getScopedData('member', 'fleets', {topic: 'RBC 60'}, accessToken);
            setData(p.data);
        }
        if (accessToken) {
            getData();
        }
    }, [accessToken])

    if (!data) {
        return <CircularProgress />;
    }

    const { filters, name } = data?.Items?.[0] || {};
    console.log(filters, name);

    return (
        <RoleRestricted role='member'>
            <FleetPicker />
            <NewFleet markList={markList} />
            <AddToFleet markList={markList} />
        </RoleRestricted >
    );
}