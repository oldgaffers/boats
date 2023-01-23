import React, { useEffect, useState } from 'react';
import { getFilterable } from './boatregisterposts';
import { CircularProgress, Typography } from '@mui/material';
import FormTemplate from '@data-driven-forms/mui-component-mapper/form-template';
import Select from '@data-driven-forms/mui-component-mapper/select';
import TextField from '@data-driven-forms/mui-component-mapper/text-field';
import { FormRenderer } from '@data-driven-forms/react-form-renderer';
import { Stack } from '@mui/system';
import { m2df } from '../util/format';
    
export default function PickOrAddBoat() {
    const [data, setData] = useState();

    useEffect(() => {
        if (!data) {
            getFilterable().then((r) => setData(r.data)).catch((e) => console.log(e));
        }
    }, [data]);

    if (!data) return <CircularProgress />;

    const options = data.map((boat) => ({
        label: `${boat.name} (${boat.oga_no}), ${boat.construction_material || ''} ${boat.rig_type || ''} ${boat.year || ''}`,
        value: boat.oga_no,
    }));

    options.sort((a, b) => {
        const an = a.label.toUpperCase();
        const bn = b.label.toUpperCase();
        if (an > bn) return 1;
        if (an < bn) return -1;
        return 0;
    });

    const handleSubmit = (data) => console.log('submit', data);

    const schema = {
        fields: [
            {
                component: 'select',
                name: 'boat',
                label: "Boat",
                isSearchable: true,
                isClearable: true,
                options,
            },
            {
                component: 'text-field',
                name: 'name',
                label: 'Name',
                isRequired: true,
                validate: [{type: 'required', message: 'This field is required'}],
                resolveProps: (_props, _field, formOptions) => {
                    const { boat } = formOptions.getState().values;
                    if (boat) {
                        return {
                            initialValue: data.find(b => b.oga_no === boat).name,
                        };
                    }
                },
            },
            {
                component: 'text-field',
                label: 'OGA No',
                name: 'oga_no',
                validate: [{type: 'required', message: 'This field is required'}],
                resolveProps: (_props, _field, formOptions) => {
                    const { boat } = formOptions.getState().values;
                    if (boat) {
                        return {
                            initialValue: boat,
                        };
                    } else {
                        return {
                            initialValue: undefined,
                        }
                    }
                },
            },
            {
                component: 'select',
                name: 'type',
                label: "Type",
                initialValue: 'yacht',
                options: [
                    { label: 'Big Boat', value: 'yacht' },
                    { label: 'Small Boat', value: 'dinghy' },
                ],
                resolveProps: (_props, _field, formOptions) => {
                    const { boat } = formOptions.getState().values;
                    if (boat) {
                        const b = data.find(b => b.oga_no === boat);
                        console.log(b.generic_type);
                        return {
                            initialValue: ['Dayboat', 'Dinghy'].includes(b.generic_type) ? 'dinghy' : 'yacht',
                        };
                    }
                },
            },
            {
                component: 'text-field',
                name: 'berthing_length',
                label: 'Berthing Length in feet',
                isRequired: true,
                validate: [{type: 'required', message: 'This field is required'}],
                resolveProps: (_props, _field, formOptions) => {
                    const { boat } = formOptions.getState().values;
                    if (boat) {
                        const b = data.find(b => b.oga_no === boat);
                        const m = b.berthing_length || b.length_on_deck || 0;
                        const f = m2df(m);
                            return {
                            initialValue: f,
                        };
                    }
                },
            },
        ]
    };

    return (
        <Stack sx={{width: '400px'}}>
            <Typography variant='h6'>Choose a boat from the register or create a new one</Typography>
            <FormRenderer
                schema={schema}
                subscription={{ values: true }}
                componentMapper={
                    { 'text-field': TextField, 'select': Select }
                }
                FormTemplate={(props) => (
                    <FormTemplate {...props} showFormControls={true} />
                )}
                onSubmit={handleSubmit}
            />
        </Stack>
    );
}