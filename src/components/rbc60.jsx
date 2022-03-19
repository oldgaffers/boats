import React from 'react';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import dataTypes from '@data-driven-forms/react-form-renderer/data-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import FormTemplate from '@data-driven-forms/mui-component-mapper/form-template';
import componentMapper from "@data-driven-forms/mui-component-mapper/component-mapper";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const ports = [
    { name: 'Ramsgate', start: '2023-04-27'},
    { name: 'Cowes', start: '2023-05-06', end: '2023-05-07'},
    { name: 'Plymouth', start: '2023-05-10', end: '2023-05-11'},
    { name: 'Milford Haven', start: '2023-05-20', end: '2023-05-21'},
    { name: 'Dublin', start: '2023-05-27', end: '2023-05-28'},
    { name: 'Oban', start: '2023-06-17', end: '2023-06-18' },
    { name: 'Arbroath', start: '2023-07-15', end: '2023-07-16', via: ['Caledonian Canal', 'Cape Wrath']},
    { name: 'Blyth', start: '2023-07-21', end: '2023-07-24'},
    { name: 'OGA60, Suffolk Yacht Harbour, River Orwell', start: '2023-08-02', end: '2023-08-06'},
];

const port = (name, start, end) => {
    if (start) {
        const st = new Date(start);
        const s = new Intl.DateTimeFormat('en-GB', {month: 'short', day: 'numeric'}).format(st);
        if (end) {
            const ed = new Date(end);
            const e = new Intl.DateTimeFormat('en-GB', {month: 'short', day: 'numeric'}).format(ed);
            return `${s}-${e} ${name}`;
        }
        return `${s} ${name}`;    
    }
    return name;
}

const schema = (ports) => {
    const fields = [];
    ports.forEach(({ name, start, end, via }, index, list) => {
        if (index > 0) {
            if (via) {
                fields.push(...via.map((leg) => {
                    return { 
                        component: componentTypes.TEXT_FIELD,
                        name: leg,
                        label: `crew spaces for the ${leg} leg`,
                        type: 'number',
                        dataType: dataTypes.INTEGER,
                        validate: [
                            {
                            type: validatorTypes.MIN_NUMBER_VALUE,
                            includeThreshold: true,
                            value: 0,
                            }
                        ],
                    };
                }));
            } else {
                fields.push({ 
                    component: componentTypes.TEXT_FIELD,
                    name: `${list[index-1].name}_${name}`,
                    label: `crew spaces for the ${list[index-1].name} - ${name} leg`,
                    type: 'number',
                    dataType: dataTypes.INTEGER,
                    validate: [
                        {
                        type: validatorTypes.MIN_NUMBER_VALUE,
                        includeThreshold: true,
                        value: 0,
                        }
                    ],
                });
            }
        }
        fields.push({ 
            component: componentTypes.CHECKBOX,
            name: name,
            label: port(name, start, end),
            dataType: dataTypes.BOOLEAN,
        });
    });
    return { fields };
};

export default function RBC60() {
    const state = {};
    const handleSubmit = () => {
        console.log('submit');
    };

    return (
        <Paper>
            <Typography variant='h3'>OGA Round Britain Cruise 2023 - RBC60</Typography>
            <Typography variant='body2'>The RBC starts at Ramsgate on 27 April 2023 and OGA members are welcome to join at any stage for part of the cruise or the whole circumnavigation. Festivities are being arranged at each of the Party Ports around the country, and all OGA members and their boats are welcome at these, not only those taking part in the RBC.  The ports and dates listed are the confirmed Party Ports.
                Please tick the boxes to indicate which ports you plan to visit. If you intend to complete the whole circumnavigation starting at Ramsgate then tick all.
            </Typography>
            <FormRenderer
                schema={schema(ports)}
                componentMapper={componentMapper}
                FormTemplate={(props) => (
                    <FormTemplate {...props} showFormControls={true} />
                )}
                onSubmit={handleSubmit}
                initialValues={state}
            />
        </Paper>
    );
}
