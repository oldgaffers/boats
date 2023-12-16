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

    const { input } = useFieldApi(props);
    const [owners, setowners] = useState(input.value);

    useEffect(() => {
        if (JSON.stringify(owners) !== JSON.stringify(input.value)) {
            // console.log('update form', owners);
            input.onChange(owners);
        }
    }, [input, owners]);

    function handleMakeHistorical(row) {
        const hist = owners.filter((o) => !o.current);
        const current = owners.filter((o) => o.current && o.id !== row.id);
        const up = [...hist, row, ...current];
        // console.log('handleMakeHistorical', up);
        setowners(up);
    }

    function handleOnUpdateCurrent(rows) {
        const hist = owners.filter((o) => !o.current);
        // console.log('handleOnUpdateCurrent', hist, rows);
        setowners([...hist, ...rows]);
    }

    function handleOnUpdateHistorical(rows) {
        const current = owners.filter((o) => o.current);
        // console.log('handleOnUpdateHistorical', current, rows);
        setowners([...rows, ...current]);
    }

    return (
        <Box sx={{ width: '100%', marginRight: "1em", border: "0.5em" }}>
            <HistoricalOwnersTable
                owners={owners.filter((o) => !o.current)}
                onUpdate={handleOnUpdateHistorical}
            />
            <CurrentOwnersTable
                owners={owners.filter((o) => o.current)}
                onMakeHistorical={handleMakeHistorical}
                onUpdate={handleOnUpdateCurrent}
            />
        </Box >
    );
}
