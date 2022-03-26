import React from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import { useAuth0 } from "@auth0/auth0-react";
import { useFieldApi } from "@data-driven-forms/react-form-renderer";
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import dataTypes from '@data-driven-forms/react-form-renderer/data-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import FormTemplate from '@data-driven-forms/mui-component-mapper/form-template';
import componentMapper from "@data-driven-forms/mui-component-mapper/component-mapper";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { PayPalButtons } from "@paypal/react-paypal-js";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LoginButton from './loginbutton';

const DDFPayPalButtons = ({ component, name, label, helperText }) => {
    // const ref = useRef(null);
    const { input } = useFieldApi({ component, name });

    const createOrder = (data, actions) => {
        console.log('Paypal createOrder', data);
        return actions.order.create({
            purchase_units: [{
                description: 'Register Interest and reserve your flag',
                amount: { currency_code: 'GBP', value: 0.1 }
            }]
        });
    };

    const approve = (data, actions) => {
        console.log('Paypal approve', data);
        return actions.order.capture().then((details) => {
            console.log('Paypal capture', details);
            // alert(`Transaction completed by ${name}`);
            input.onChange(details);
        });
    }
    return (
        <Box display="block">
            <Typography variant="h4" sx={{ paddingTop: ".5em", paddingBottom: ".5em" }}>{label}</Typography>
            <PayPalButtons style={{
                shape: 'rect',
                color: 'blue',
                layout: 'vertical',
                label: 'paypal',
            }}
                createOrder={createOrder}
                onApprove={approve}
            />
            <Typography variant="body2" sx={{ paddingTop: ".5em", paddingBottom: ".5em" }}>{helperText}</Typography>
        </Box>
    );
};

const ports = [
    { name: 'Ramsgate', start: '2023-04-27' },
    { name: 'Cowes', start: '2023-05-06', end: '2023-05-07' },
    { name: 'Plymouth', start: '2023-05-10', end: '2023-05-11' },
    { name: 'Milford Haven', start: '2023-05-20', end: '2023-05-21' },
    { name: 'Dublin', start: '2023-05-27', end: '2023-05-28' },
    { name: 'Oban', start: '2023-06-17', end: '2023-06-18' },
    { name: 'Arbroath', start: '2023-07-15', end: '2023-07-16', via: ['Caledonian Canal', 'Cape Wrath'] },
    { name: 'Blyth', start: '2023-07-21', end: '2023-07-24' },
    { name: 'OGA60, Suffolk Yacht Harbour, River Orwell', start: '2023-08-02', end: '2023-08-06' },
];

const port = (name, start, end) => {
    if (start) {
        const st = new Date(start);
        const s = new Intl.DateTimeFormat('en-GB', { month: 'short', day: 'numeric' }).format(st);
        if (end) {
            const ed = new Date(end);
            const e = new Intl.DateTimeFormat('en-GB', { month: 'short', day: 'numeric' }).format(ed);
            return `${s}-${e} ${name}`;
        }
        return `${s} ${name}`;
    }
    return name;
}

const legfield = (name, label) => {
    return {
        component: componentTypes.TEXT_FIELD,
        name: `leg.${name}`,
        helperText: 'leave blank or enter the maximum number of spaces you might have',
        label: `crew spaces for the ${label} leg`,
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
};

export default function RBC60() {
    const [getBoats, { loading, error, data }] = useLazyQuery(gql`query boats { boat { name oga_no } }`);
    const { user, isAuthenticated } = useAuth0();

    if (loading) return <CircularProgress />;
    if (error) return <p>Error :(can't get picklists)</p>;
    let roles = [];
    if (isAuthenticated && user) {
        if (user['https://oga.org.uk/roles']) {
            roles = user['https://oga.org.uk/roles'];
        }
    }
    let pickers = {};
    if (data) {
        pickers = data;
    } else {
        getBoats();
        return <CircularProgress />;
    }

    const state = {
        skipper_email: user && user.email,
    };

    console.log('roles', roles);
    console.log('user', user);
    console.log(pickers.boat);
    const boatOptions = [
        {
            label: "My boat isn't listed",
            value: "My boat isn't listed",
            selectNone: true,
        },
        ...pickers.boat.map((boat) => {
            const text = `${boat.name} (${boat.oga_no})`;
            return { label: text, value: text };
        }).sort((a, b) => a.label > b.label)
    ];

    const handleSubmit = (values) => {
        const { skipper_email, boat, ...rest } = values;
        console.log('submit', skipper_email, boat);
        console.log('submit', rest);
    };

    const schema = (ports) => {
        const fields = [];
        ports.forEach(({ name, start, end, via }, index, list) => {
            if (index > 0) {
                if (via) {
                    fields.push(...via.map((leg) => legfield(leg, leg)));
                } else {
                    fields.push(legfield(`${list[index - 1].name}_${name}`, `${list[index - 1].name} - ${name}`));
                }
            }
            fields.push({
                component: componentTypes.CHECKBOX,
                name: `port.${name}`,
                label: port(name, start, end),
                dataType: dataTypes.BOOLEAN,
            });
        });
        return {
            fields: [
                {
                    component: componentTypes.PLAIN_TEXT,
                    name: 'ddf.about',
                    label: "Tell us about your boat",
                    variant: 'h4',
                    sx: { marginTop: ".8em" }
                },
                {
                    component: componentTypes.SELECT,
                    name: 'boat',
                    helperText: "if you can't find your boat on the register, we will add it",
                    label: 'Boat Name',
                    options: boatOptions,
                    isSearchable: true,
                    isRequired: true,
                    validate: [
                        {
                            type: validatorTypes.REQUIRED,
                        },
                    ],
                },
                {
                    component: componentTypes.TEXT_FIELD,
                    name: 'ddf.np',
                    label: "The boat register editors will be in touch to get your boat added",
                    isReadOnly: true,
                    condition: {
                        when: 'boat',
                        is: 'select-none',
                    },
                },
                {
                    component: 'paypal',
                    name: 'payment',
                    label: 'Reserve your flag',
                    helperText: 'We are asking all skippers to reserve a flag up front for £15.'
                        + 'This will help us know how many boats to plan for. ',
                    validate: [{ type: validatorTypes.REQUIRED }],
                },
                {
                    component: componentTypes.TEXT_FIELD,
                    name: 'skipper_email',
                    helperText: 'this ought to be auto-filled with the email of the logged-in user',
                    label: 'Email',
                    type: 'email',
                    resolveProps: (props, { meta, input }, formOptions) => {
                        const paypal = formOptions.getFieldState('payment');
                        if (paypal && paypal.value) {
                            console.log('email', paypal.value.payer);
                            return { initialValue: paypal.value.payer.email_address }
                        }
                        return { initialValue: '' };
                    },
                    validate: [
                        { type: validatorTypes.REQUIRED },
                        {
                          type: validatorTypes.PATTERN,
                          pattern: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
                        }
                    ]
                },
                {
                    component: componentTypes.PLAIN_TEXT,
                    name: 'ddf.rbc',
                    label: "Are you planning to complete a circumnavigation?",
                    variant: 'h4',
                    sx: { marginTop: ".5em" }
                },
                {
                    component: componentTypes.CHECKBOX,
                    name: 'rbc',
                    label: "I plan to take my boat all the way round",
                    dataType: dataTypes.BOOLEAN,
                },
                {
                    component: componentTypes.PLAIN_TEXT,
                    name: 'ddf.ports1',
                    label: "Please check all the 'party' ports you plan to bring your boat to.",
                    variant: 'h4',
                    sx: { marginTop: ".5em" }
                },
                {
                    component: componentTypes.PLAIN_TEXT,
                    name: 'ddf.ports2',
                    label: 'If you can offer crewing opportunities for any of the legs please indicate how many spaces you might have',
                    // variant: 'h4',
                },
                ...fields,
                {
                    component: componentTypes.PLAIN_TEXT,
                    name: 'ddf.ecc',
                    label: "The East Coast annual Summer Cruise follows OGA 60.",
                    variant: 'h4',
                    sx: { marginTop: ".5em" }
                },
                {
                    component: componentTypes.CHECKBOX,
                    name: 'ecc',
                    label: "I'd like to bring my boat along to the East Coast Summer Cruise",
                    dataType: dataTypes.BOOLEAN,
                },
                {
                    component: componentTypes.TEXT_FIELD,
                    isReadOnly: true,
                    hideField: true,
                    initialValue: 0,
                    name: 'ddf.count',
                    resolveProps: (props, { meta, input }, formOptions) => {
                        const fields = formOptions.getRegisteredFields();
                        return { initialValue: fields.reduce((acc, field) => {
                            if (field.startsWith('port')) {
                                const port = formOptions.getFieldState(field);
                                if (port.value) {
                                    return acc + 1;
                                }
                            }
                            return acc;
                            }, 0) };
                    },
                    // validate: [{ type: validatorTypes.MIN_NUMBER_VALUE, threshold: 1 }]
                },
                {
                    component: componentTypes.TEXT_FIELD,
                    isReadOnly: true,
                    name: 'ddf.val',
                    resolveProps: (props, { meta, input }, formOptions) => {
                        const countField = formOptions.getFieldState('ddf.count');
                        console.log(countField);
                        const count = countField && countField.value;
                        console.log('count', count);
                        const boatField = formOptions.getFieldState('boat');
                        let boat = 'your boat';
                        if (boatField && boatField.valid && boatField.value !== "My boat isn't listed") {
                            boat = boatField.value;
                        }
                        let flag = false;
                        const paypal = formOptions.getFieldState('payment');
                        if (paypal && paypal.value) {
                            console.log('flag', paypal.value.status);
                            if (paypal.value.status === 'COMPLETED') {
                                flag = true;
                            }
                        }
                        if (flag) {
                            switch (count) {
                                case 0:
                                    return { initialValue: 'You have bought a flag but havent checked any ports' };
                                case 1:
                                    return { initialValue: `You have bought a flag and you are planning to bring ${boat} to one port` };
                                default:
                                    return { initialValue: `You have bought a flag and you are planning to bring ${boat} to ${count} ports!` };
                            }    
                        } else {
                            switch (count) {
                                case 0:
                                    return { initialValue: 'You havent checked any ports or bought a flag' };
                                case 1:
                                    return { initialValue: `You are planning to bring ${boat} to one port - please buy a flag` };
                                default:
                                    return { initialValue: `You are planning to bring ${boat} to ${count} ports! - Please buy a flag` };
                            }
                        }
                    },
                }
            ]
        };
    };

    return (
        <Paper>
            <Grid container spacing={2}>
            <Grid xs={8}>
            <Typography variant='h3'>OGA Round Britain Cruise 2023 - RBC60</Typography>
            </Grid>
            <Grid xs={2}>
            <LoginButton />
            </Grid>
            <Grid xs={12}>
            <Typography variant='body2'>The RBC starts at Ramsgate on 27 April 2023 and OGA members are welcome to join at any stage for part of the cruise or the whole circumnavigation. Festivities are being arranged at each of the Party Ports around the country, and all OGA members and their boats are welcome at these, not only those taking part in the RBC.  The ports and dates listed are the confirmed Party Ports.
                Please tick the boxes to indicate which ports you plan to visit. If you intend to complete the whole circumnavigation starting at Ramsgate then tick all.
            </Typography>
            </Grid>
            <Grid sx={12}>
            <FormRenderer
                schema={schema(ports)}
                subscription={{ values: true }}
                componentMapper={{
                    ...componentMapper,
                    paypal: DDFPayPalButtons,
                }}
                FormTemplate={(props) => (
                    <FormTemplate {...props} showFormControls={true} />
                )}
                onSubmit={handleSubmit}
                initialValues={state}
            />
            </Grid>
            </Grid>
        </Paper>
    );
}
