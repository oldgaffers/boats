import React from 'react';
import Button from "@mui/material/Button";

export default function UpdateFleet({
    onSubmit,
    markList = [],
    fleet,
    id,
}) {

    if (markList?.length === 0) {
        return '';
    }

    if (!fleet) {
        return '';
    }

    const inFleet = fleet.filters.oga_nos;
    const merged = [...new Set([...inFleet, ...markList])];

    const b = (markList.length === 1) ? 'boat' : 'boats';

    let message = `Add ${markList.length} ${b} to ${fleet.name}`;
    if (merged.length === inFleet.length) {
        message = `Remove ${markList.length} ${b} from ${fleet.name}`;
    }
    if (fleet.owner_gold_id !== id) {
        message = 'You can only edit your own fleets';
    }

    const handleClick = (event) => {
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
        onSubmit(data, 'static');
    };

    return (
        <Button
            disabled={fleet.owner_gold_id !== id}
            color='primary' size='small' variant='contained'
            onClick={handleClick}
        >{message}</Button>
    );
}