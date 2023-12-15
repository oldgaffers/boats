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

    const [owners, setOwners] = useState(input.value || []);

    const ownersWithId = owners.map((owner, index) => {
        return {
            ...owner,
            id: index,
            goldId: owner.id, // needed for ownerName
        }
    }).sort((a, b) => a.start > b.start);

    return (
        <Box sx={{
            width: '100%',
            marginRight: "1em",
            border: "0.5em", display: 'grid', gridTemplateRows: 'auto',
        }}
        >
            <HistoricalOwnersTable owners={ownersWithId.filter((o) => !o.current)} />
            <CurrentOwnersTable owners={ownersWithId.filter((o) => o.current)} />
        </Box >
    );
}
