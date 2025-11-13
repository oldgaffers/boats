import React, { useContext, useState } from "react";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { useAuth0 } from "@auth0/auth0-react";
import { postScopedData } from '../util/api';
import { TokenContext } from './TokenProvider';

export default function UpdateFleet({ markList=[], fleet, updated = () => console.log('updated') }) {
    const accessToken = useContext(TokenContext);
    const { user } = useAuth0();
    const id = user?.["https://oga.org.uk/id"];
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState();

    if (markList?.length === 0) {
        return '';
    }

    if (!fleet) {
        return '';
    }

    const inFleet = fleet.filters.oga_nos;
    const merged = [...new Set([...inFleet, ...markList])];

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setPopoverOpen(true);
        let wanted = merged;
        if (merged.length === inFleet.length) {
            wanted = inFleet.filter((b) => !markList.includes(b));
        }
        const data = {
            ...fleet,
            owner_gold_id: id,
            filters: { oga_nos: wanted },
            updated_at: (new Date()).toISOString(),
         };
         const scope = fleet.public ? 'public' : 'member';
        postScopedData(scope, 'fleets', data, accessToken)
            .then((response) => {
                if (response.ok) {
                    setPopoverOpen(false);
                    updated();
                } else {
                    setPopoverOpen(false);
                }
            })
            .catch((e) => {
                // console.log(e);
                setPopoverOpen(false);
            });
    }

    const b = (markList.length === 1) ? 'boat' : 'boats';

    let message = `Add ${markList.length} ${b} to ${fleet.name}`;
    if (merged.length === inFleet.length) {
        message = `Remove ${markList.length} ${b} from ${fleet.name}`;
    }
    if (fleet.owner_gold_id !== id) {
        message = 'You can only edit your own fleets';
    }

    return (
        <>
        <Button
            disabled={fleet.owner_gold_id !== id}
            color='primary' size='small' variant='contained'
            onClick={handleClick}
        >{message}</Button>
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
        </>
    );
}