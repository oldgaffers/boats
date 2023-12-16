import React, { useState } from 'react';
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

    const owners = input.value;
    const [currentOwners, setCurrentOwners] = useState(owners.filter((o) => o.current));
    const [historicalOwners, setHistoricalOwners] = useState(owners.filter((o) => !o.current));

    return (
        <Box sx={{
            width: '100%',
            marginRight: "1em",
            border: "0.5em", display: 'grid', gridTemplateRows: 'auto',
        }}
        >
            <HistoricalOwnersTable
                owners={historicalOwners}
                onUpdate={(rows) => setHistoricalOwners(rows)}
            />
            <CurrentOwnersTable
                owners={currentOwners}
                onAddHistorical={(row) => setHistoricalOwners([...historicalOwners, row])}
                onUpdate={(rows) => setCurrentOwners(rows)}
            />
        </Box >
    );
}
