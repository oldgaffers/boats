import { useContext, useState, useEffect } from 'react';
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useAuth0 } from '@auth0/auth0-react';
import { getFleets } from '../util/api';
import Picker from './picker';
import NewFleet from './newfleet';
import UpdateFleet from './updatefleet';
import { MarkContext } from "./browseapp";

export default function FleetButtons({
    onChange = () => console.log('fleet change'),
    filters,
    filtered,
}) {
    const [items, setItems] = useState();
    const [selected, setSelected] = useState();
    const markList = useContext(MarkContext);
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0()
    const id = user?.["https://oga.org.uk/id"];

    useEffect(() => {
        const getData = async () => {
            if (isAuthenticated) {
                const accessToken = await getAccessTokenSilently();
                const p = await getFleets('public', { public: true }, accessToken);
                const q = await getFleets('member', { owner_gold_id: id }, accessToken);
                setItems([...p, ...q]);
            }
        }
        if (isAuthenticated && !items) {
            getData();
        }
    }, [isAuthenticated, items, id])

    if (isAuthenticated && !items) {
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

    const fleet = items?.find((f) => f.name === selected);

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
            <NewFleet markList={markList} filters={filters} selected={selected} updated={fleetsUpdated} filtered={filtered} />
            <UpdateFleet
                markList={markList}
                fleet={fleet}
                updated={fleetsUpdated}
            />
        </Stack>
    );
}
