import React, { useState } from 'react';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
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
import Snackbar from "@mui/material/Snackbar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LoginButton from './loginbutton';

const DDFPayPalButtons = ({ component, name, label, helperText }) => {
    const { input } = useFieldApi({ component, name });

    const createOrder = (data, actions) => {
        console.log('Paypal createOrder', data);
        return actions.order.create({
            purchase_units: [{
                description: 'Register Interest and reserve your flag',
                amount: { currency_code: 'GBP', value: 15 }
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
            <Typography variant="h6" sx={{ paddingTop: ".5em", paddingBottom: ".5em" }}>{label}</Typography>
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

const viafield = (name, label) => {
    return {
        component: componentTypes.CHECKBOX,
        name: `via.${name}`,
        label: `I plan to sail the ${label} leg`,
        dataType: dataTypes.BOOLEAN,
        condition: {
            when: 'crew',
            is: false,
        },

    };
};

const crewlegfield = (name, label) => {
    return {
        component: componentTypes.TEXT_FIELD,
        name: `leg.${name}`,
        helperText: 'If you might have space for OGA members to help crew,'
            + ' you can indicate the maximum number of spaces here.',
        label: `possible spaces for the ${label} leg`,
        type: 'number',
        dataType: dataTypes.INTEGER,
        validate: [
            {
                type: validatorTypes.MIN_NUMBER_VALUE,
                includeThreshold: true,
                value: 0,
            }
        ],
        condition: {
            when: 'crew',
            is: true,
        },

    };
};

const boatOptionArray = (pickers, member) => {
    const owned = [];
    const other = [];

    pickers.boat.forEach((boat) => {
        const text = `${boat.name} (${boat.oga_no})`;
        if (member && boat.ownerships) {
            if (boat.ownerships.current) {
                const current = boat.ownerships.current.find((o) => o.member === member);
                if (current) {
                    owned.push({ label: text, value: text });
                } else {
                    other.push({ label: text, value: text });
                }
            } else {
                const current = boat.ownerships.owners && boat.ownerships.owners.find((o) => o.current);
                if (current && current.member === member) {
                    owned.push({ label: text, value: text });
                } else {
                    other.push({ label: text, value: text });
                }
            }
        } else {
            other.push({ label: text, value: text });
        }
    })
    return { owned: owned.sort((a, b) => a.label > b.label), other: other.sort((a, b) => a.label > b.label) };
}

export default function RBC60() {
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [getBoats, { loading, error, data }] = useLazyQuery(gql`query boats { boat { name oga_no id ownerships } }`);
    // const [getOgaNos, ogaNosState] = useLazyQuery(gql(`query ogano { boat { oga_no } }`));
    const [addRegistration, result] = useMutation(gql`
        mutation AddRegistration($data: jsonb!) {
        insert_rbc60_notification(objects: {data: $data}) { affected_rows } }
    `);
    const { user, isAuthenticated } = useAuth0();

    let userState;

    console.log('user', user, 'isAuthenticated', isAuthenticated);

    if (result) {
        console.log('mutation', result);
    }

    if (loading) return <CircularProgress />;
    if (error) {
        // return <p>Error :(can't get picklists)</p>;
    }
    // let roles = [];
    let member;
    if (isAuthenticated && user) {
        member = user["https://oga.org.uk/member"];
        // if (user['https://oga.org.uk/roles']) {
        //    roles = user['https://oga.org.uk/roles'];
        //}
        console.log('member', member);
        if (member) {
            userState = 'member';
        } else {
            userState = 'user';
        }
    } else {
        userState = 'not logged in'
    }
    let pickers = { boat: [] };
    if (data) {
        pickers = data;
    } else {
        getBoats();
        return <CircularProgress />;
    }

    const UNLISTED = "My boat isn't listed";

    const handleSubmit = (values) => {
        const { ddf, ...data } = values;
        console.log('submit', data);
        console.log('boat', data.boat);
        if (data.boat === UNLISTED) {
            if (ddf.create_boat) {
                console.log('new boat', ddf.create_boat);
                data.boat = { name: ddf.create_boat.boat.name };
                data.create_boat = ddf.create_boat;
            } else {
                console.log('TODO - unlisted boat');
                data.boat = {};
            }
        } else {
            const [name, ogaNo] = data.boat.split(/[()]/);
            data.boat = { name: name.trim(), oga_no: ogaNo && parseInt(ogaNo) };
        }
        if (user) {
            data.user = user;
        }
        data.port = Object.keys(data.port);
        data.leg = Object.keys(data.leg).map((leg) => {
            const [from, to] = leg.split('_');
            return { from, to, spaces: data.leg[leg] }
        });
        addRegistration({ variables: { data } });
        setSnackBarOpen(true);
    };

    const handleSnackBarClose = () => {
        setSnackBarOpen(false);
        // eslint-disable-next-line no-restricted-globals
        history.go(0);
    }

    const schema = (ports) => {
        const fields = [];
        ports.forEach(({ name, start, end, via }, index, list) => {
            if (index > 0) {
                if (via) {
                    fields.push(...via.map((leg) => viafield(leg, leg)));
                    fields.push(...via.map((leg) => crewlegfield(leg, leg)));
                } else {
                    fields.push(crewlegfield(`${list[index - 1].name}_${name}`, `${list[index - 1].name} - ${name}`));
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
                    label: "About you",
                    variant: 'h6',
                    sx: { marginTop: ".8em" }
                },
                {
                    component: componentTypes.TEXT_FIELD,
                    label: 'Type of login',
                    name: 'userState',
                    isReadOnly: true,
                    hideField: true,
                    initialValue: userState,
                },
                {
                    component: componentTypes.TEXT_FIELD,
                    name: 'user',
                    isReadOnly: true,
                    hideField: true,
                    label: 'USER',
                    initialValue: user || 'NONE',
                },
                {
                    component: componentTypes.CHECKBOX,
                    name: 'ddf.member',
                    label: "I am a member of the OGA",
                    variant: 'h6',
                    sx: { marginTop: ".8em" },
                    resolveProps: (props, { meta, input }, formOptions) => {
                        console.log(input)
                        return {
                            helperText: input.value ? (<Typography>Great - what is your membership number?</Typography>) : (<Typography>If you would like to join RBC60 you can do so by taking out a 12 month membership for 2023 <a href="https://oga.org.uk/about/membership.html">here</a>.</Typography>),
                        }
                    },
                    condition: {
                        when: 'userState',
                        is: 'not logged in',
                    },
                },
                {
                    component: componentTypes.TEXT_FIELD,
                    name: 'ddf.member_no',
                    label: "Membership Number",
                    helperText: "Enter your membership number.",
                    type: 'number',
                    condition: {
                        when: 'ddf.member',
                        is: true,
                    },
                    isRequired: true,
                    validate: [{ type: validatorTypes.REQUIRED }],
                },
                {
                    component: componentTypes.PLAIN_TEXT,
                    name: 'ddf.about',
                    label: "About your boat",
                    variant: 'h6',
                    sx: { marginTop: ".8em" }
                },
                {
                    component: componentTypes.SELECT,
                    name: 'boat',
                    initializeOnMount: true,
                    helperText: "if you can't find your boat on the register, we will add it",
                    label: 'Boat Name',
                    isSearchable: true,
                    isClearable: true,
                    isRequired: true,
                    validate: [{ type: validatorTypes.REQUIRED }],
                    resolveProps: (props, { meta, input }, formOptions) => {

                        const m = formOptions.getFieldState('ddf.member_no');
                        const memberNo = m && Number(m.value);
                        console.log('memberNo', memberNo, member);

                        const mno = member || memberNo;

                        const boatOptions = [];
                        const { owned, other } = boatOptionArray(pickers, mno);

                        boatOptions.push({
                            label: UNLISTED,
                            value: UNLISTED,
                            selectNone: true,
                        });
                        boatOptions.push(...owned);
                        boatOptions.push(...other);
                        return { options: boatOptions }
                    }
                },
                {
                    component: 'paypal',
                    name: 'payment',
                    label: 'Sign Up and Reserve your flag',
                    helperText: 'We are asking all skippers to reserve a flag up front for £15.'
                        + ' This will help us know how many boats to plan for. '
                        + ' (This is not the real Paypal, log in with gmc@oga.org.uk as the username and oldgaffers as the password.'
                        + ' Or use this fake card: VISA 4137357753267626, expires 04/2027, CVC 123.)',
                    validate: [{ type: validatorTypes.REQUIRED }],
                },
                {
                    component: componentTypes.TEXT_FIELD,
                    initialValue: 1,
                    type: 'number',
                    dataType: dataTypes.INTEGER,
                    label: 'Number of people likely to be aboard',
                    name: 'people_on_board',
                },
                {
                    component: componentTypes.PLAIN_TEXT,
                    name: 'ddf.rbc',
                    label: "Are you planning to complete a circumnavigation?",
                    variant: 'h6',
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
                    variant: 'h6',
                    sx: { marginTop: ".5em" }
                },
                {
                    component: componentTypes.CHECKBOX,
                    name: 'crew',
                    label: 'If you want to offer crewing opportunities for any of the legs, check here',
                    helperText: 'You don\t need to decide now, just leave the box unchecked if you haven\'t decided yet',
                    dataType: dataTypes.BOOLEAN,
                },
                ...fields,
                {
                    component: componentTypes.PLAIN_TEXT,
                    name: 'ddf.ecc',
                    label: "The East Coast annual Summer Cruise follows OGA 60.",
                    variant: 'h6',
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
                        return {
                            initialValue: fields.reduce((acc, field) => {
                                if (field.startsWith('port')) {
                                    const port = formOptions.getFieldState(field);
                                    if (port.value) {
                                        return acc + 1;
                                    }
                                }
                                return acc;
                            }, 0)
                        };
                    },
                    // validate: [{ type: validatorTypes.MIN_NUMBER_VALUE, threshold: 1 }]
                },
                {
                    component: componentTypes.TEXT_FIELD,
                    isReadOnly: true,
                    name: 'ddf.val',
                    resolveProps: (props, { meta, input }, formOptions) => {
                        const countField = formOptions.getFieldState('ddf.count');
                        console.log('countField', countField);
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
                                    return { initialValue: `You have bought a flag and you are planning to bring ${boat} to one port, click submit to complete registration.` };
                                default:
                                    return { initialValue: `You have bought a flag and you are planning to bring ${boat} to ${count} ports! Click submit to complete registration.` };
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
                <Grid item xs={10}>
                    <Typography variant='h3'>OGA Round Britain Cruise 2023 - RBC60</Typography>
                </Grid>
                <Grid item xs={2}>
                    <LoginButton />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant='body1'>
                        {user ? `Hello ${user.given_name || user.name}. ` : ''}
                        This form is for OGA members to sign up to sail all or part of the OGA 60 Round Britain Cruise (RBC60).
                    </Typography>
                    <Typography variant='body1'>
                        If you are interested in joining all or part of the cruise on someone else's boat go to our <a href='https://oga.org.uk/oga60/rbc60_crewing_opportunities.html'>Crewing page</a>.
                    </Typography>
                    <Typography variant='body1'>
                        If you are interested in bringing a boat one of the OGA60 small boat events go to our <a href='https://oga.org.uk/oga60/small_boat_events.html'>Small Boat Events page</a>.
                    </Typography>
                    <Typography variant='body1'>
                        If you want more information about OGA60 in genreral go to the main <a href='https://oga.org.uk/oga60/oga60.html'>OGA60 page</a>.
                    </Typography>
                    <Typography variant='body1'>
                        Festivities are being arranged at each of the Party Ports around the country, and all OGA members and their boats are welcome at these, not only those taking part in the RBC.
                    </Typography>
                    <Typography variant='body1'>
                        These events are organised by the Areas and you will be able to register for them separately from the main <a href='https://oga.org.uk/events/events.html'>Events page</a>.
                    </Typography>
                    <Typography variant='body1'>
                        The ports and dates listed are the confirmed Party Ports.
                    </Typography>
                    <Typography variant='body1'>
                        Please tick the boxes to indicate which ports you plan to visit.
                    </Typography>
                </Grid>
                <Grid item sx={12}>
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
                    />
                </Grid>
            </Grid>
            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                open={snackBarOpen}
                autoHideDuration={2000}
                onClose={handleSnackBarClose}
                message="Thanks, we'll get back to you."
                severity="success"
            />
        </Paper>
    );
}
