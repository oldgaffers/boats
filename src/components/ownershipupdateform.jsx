import React, { useEffect, useState } from 'react';
import componentTypes from "@data-driven-forms/react-form-renderer/component-types";
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import Box from '@mui/material/Box';
import HistoricalOwnersTable from './HistoricalOwnersTable';
import CurrentOwnersTable from './CurrentOwnersTable';

export const ownershipUpdateFields = [
    {
        component: componentTypes.PLAIN_TEXT,
        name: 'ddf.ownerships_label',
        label: 'You can add, remove and edit ownership records on this page.'
            + 'New records will be added to the end of the list. You can edit rows once added.'
            + ' Your changes will be send to the editors who will update the boat\'s record'
    },
    {
        component: "ownership-form",
        name: "ownerships",
        label: "Known Owners",
    },
];

export const ownershipUpdateForm = {
    title: "Update Ownerships",
    name: "ownerships",
    component: componentTypes.SUB_FORM,
    TitleProps: { sx: { marginBottom: '1em' } },
    fields: ownershipUpdateFields,
};

export default function OwnershipForm(props) {
    const [up, setUp] = useState();

    const { input } = useFieldApi(props);

    useEffect(() => {
        if (up) {
            input.onChange(up);
            setUp(undefined);
        }
    }, [input, up]);

    function handleAddHistorical(row) {
        const other = input.value.filter((o) => o.id !== row.id); // will be all rows if we are adding
        const r = [...other, row];
        console.log('handleAddHistorical', r);
        setUp(r);
        // input.onChange(r);
    }

    function handleOnUpdateCurrent(rows) {
        const hist = input.value.filter((o) => !o.current);
        console.log('handleOnUpdateCurrent', hist, rows);
       // input.onChange([...hist, ...rows]);
       setUp([...hist, ...rows]);
    }

    function handleOnUpdateHistorical(rows) {
        const current = input.value.filter((o) => o.current);
        console.log('handleOnUpdateHistorical', current, rows);
        // input.onChange([...rows, ...current]);
        setUp([...rows, ...current]);
    }

    return (
        <Box sx={{ width: '100%', marginRight: "1em", border: "0.5em" }}>
            <HistoricalOwnersTable
                owners={input.value.filter((o) => !o.current)}
                onUpdate={handleOnUpdateHistorical}
            />
            <CurrentOwnersTable
                owners={input.value.filter((o) => o.current)}
                onAddHistorical={handleAddHistorical}
                onUpdate={handleOnUpdateCurrent}
            />
        </Box >
    );
}
