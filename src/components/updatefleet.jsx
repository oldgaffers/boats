import React, { useContext, useState } from "react";
import Button from "@mui/material/Button";
import { postPrivateScopedData } from "./boatregisterposts";
import { Popover, Typography } from "@mui/material";
import { TokenContext } from './TokenProvider';

export default function UpdateFleet({ markList=[], fleet, updated=()=>console.log('updated') }) {
    const accessToken = useContext(TokenContext);
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
            filters: { oga_nos: wanted },
            updated_at: (new Date()).toISOString(),
         };
        postPrivateScopedData('member', 'fleets', data, accessToken)
            .then(() => {
                setPopoverOpen(false);
                updated();
            })
            .catch((e) => {
                console.log(e);
                setPopoverOpen(false);
            });
    }

    const b = (markList.length === 1) ? 'boat' : 'boats';

    let message = `Add ${markList.length} ${b} to ${fleet.name}`;
    if (merged.length === inFleet.length) {
        message = `Remove ${markList.length} ${b} from ${fleet.name}`;
    }

    return (
        <>
        <Button color='primary' size='small' variant='contained' onClick={handleClick}
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