import React, { useState } from 'react';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { useAuth0 } from "@auth0/auth0-react";
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import dataTypes from '@data-driven-forms/react-form-renderer/data-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import FormTemplate from '@data-driven-forms/mui-component-mapper/form-template';
import componentMapper from "@data-driven-forms/mui-component-mapper/component-mapper";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Grid from "@mui/material/Grid";
import LoginButton from './loginbutton';
import { DDFPayPalButtons } from './ddf/paypal';

const ports = [
    { name: 'Ramsgate', start: '2023-04-27' },
    { name: 'Cowes', start: '2023-05-06', end: '2023-05-07' },
    { name: 'Plymouth', start: '2023-05-10', end: '2023-05-11' },
    { name: 'Milford Haven', start: '2023-05-20', end: '2023-05-21' },
    { name: 'Dublin', start: '2023-05-27', end: '2023-05-28' },
    { name: 'Oban', start: '2023-06-17', end: '2023-06-18' },
    { name: 'Arbroath', start: '2023-07-15', end: '2023-07-16', via: { routeName: 'scotland', choices: ['Caledonian Canal', 'Cape Wrath'] } },
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

const crewlegfield = (name, label, routeName) => {
    console.log('crewlegfield', name, label, routeName);
    const conditions = [{ when: 'crew', is: true }];
    if (routeName) {
        conditions.push({ when: routeName, is: name });
    }
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
        condition: { and: conditions },
    };
};

const portFields = (ports, route) => {
    console.log('port fields route', route);
    const fields = [];
    ports.forEach(({ name, start, end, via }, index, list) => {
        if (index > 0) {
            if (via) {
                fields.push(...via.choices.map((leg) => crewlegfield(leg, leg, via.routeName)));
            } else {
                const legName = `${list[index - 1].name}_${name}`;
                const label = `${list[index - 1].name} - ${name}`;
                fields.push(crewlegfield(legName, label));
            }
        }
        fields.push({
            component: componentTypes.CHECKBOX,
            name: `port.${name}`,
            label: port(name, start, end),
            dataType: dataTypes.BOOLEAN,
        });
    });
    return fields;
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
    const [getBoats, getBoatsState] = useLazyQuery(gql`query boats { boat { name oga_no id ownerships } }`);
    const [addRegistration, result] = useMutation(gql`
        mutation AddRegistration($data: jsonb!) {
        insert_rbc60_notification(objects: {data: $data}) { affected_rows } }
    `);
    const { user, isAuthenticated } = useAuth0();

    let userState;

    if (result) {
        // console.log('mutation', result);
    }

    if (getBoatsState.loading) return <CircularProgress />;
    if (getBoatsState.error) {
        // return <p>Error :(can't get picklists)</p>;
    }
    // let roles = [];
    let member;
    if (isAuthenticated && user) {
        member = user["https://oga.org.uk/member"];
        if (member) {
            userState = 'member';
        } else {
            userState = 'user';
        }
    } else {
        userState = 'not logged in'
    }
    let pickers = { boat: [] };
    let firstFreeOgaNo;
    if (getBoatsState.data) {
        pickers = getBoatsState.data;
        const ogaNos = pickers.boat.map((boat) => Number(boat.oga_no)).sort((a, b) => a - b);
        const idx = ogaNos.findIndex((val, index, vals) => val + 1 !== vals[index + 1]);
        firstFreeOgaNo = ogaNos[idx] + 1;
    } else {
        getBoats();
        return <CircularProgress />;
    }

    const UNLISTED = "My boat isn't listed";

    const handleSubmit = (values) => {
        const { ddf, ...data } = values;
        if (data.boat === UNLISTED) {
            data.boat = { name: ddf.boatname, oga_no: firstFreeOgaNo };
            data.new_boat = true;
        } else {
            const [name, ogaNo] = data.boat.split(/[()]/);
            data.boat = { name: name.trim(), oga_no: ogaNo && parseInt(ogaNo) };
        }
        if (user) {
            data.user = {
                name: user.name,
                email: user.email,
                member: user["https://oga.org.uk/member"],
                id: user["https://oga.org.uk/id"],
            }
        } else {
            data.user = {
                email: data.payment.payer.email_address,
                name: `${data.payment.payer.name.given_name} ${data.payment.payer.name.surname}`,
                member: ddf.member_no,
            }
        }
        data.port = Object.keys(data.port);
        if (data.leg) {
            data.leg = Object.keys(data.leg).map((leg) => {
                const [from, to] = leg.split('_');
                return { from, to, spaces: data.leg[leg] }
            });
        }
        addRegistration({ variables: { data } });
        setSnackBarOpen(true);
    };

    const handleSnackBarClose = () => {
        setSnackBarOpen(false);
        // eslint-disable-next-line no-restricted-globals
        history.go(0);
    }

    const schema = (ports) => {
        return {
            fields: [
                {
                    "component": componentTypes.SUB_FORM,
                    "title": "About you",
                    "name": "ddf.about.skipper",
                    "fields": [
                        {
                            component: componentTypes.TEXT_FIELD,
                            label: 'Type of login',
                            name: 'ddf.userState',
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
                            resolveProps: (props, { meta, input }, formOptions) => {
                                return {
                                    helperText: input.value ? (<Typography>Great - what is your membership number?</Typography>) : (<Typography>If you are not a member and would like to join RBC60 you can do so by taking out a 12 month membership for 2023 <a href="https://oga.org.uk/about/membership.html">here</a>.</Typography>),
                                }
                            },
                            condition: {
                                when: 'ddf.userState',
                                is: 'not logged in',
                            },
                        },
                        {
                            component: componentTypes.TEXT_FIELD,
                            name: 'ddf.member_no',
                            label: "Membership Number",
                            helperText: "Enter your membership number. (if you LOGIN we will already have your Membership Number).",
                            type: 'number',
                            condition: {
                                when: 'ddf.member',
                                is: true,
                            },
                            isRequired: true,
                            validate: [{ type: validatorTypes.REQUIRED }],
                        },
                        {
                            component: componentTypes.TEXT_FIELD,
                            name: 'ddf.show_user',
                            label: '',
                            isReadOnly: true,
                            condition: {
                                when: 'ddf.userState',
                                is: 'member',
                            },
                            resolveProps: (props, { meta, input }, formOptions) => {
                                if (member) {
                                    return {
                                        value: `We've identified you as ${user.given_name} ${user.family_name}, member ${member}.`,
                                    }
                                }
                            },
                        },
                    ]
                },
                {
                    component: componentTypes.SUB_FORM,
                    name: 'ddf.about.boat',
                    title: "About your boat",
                    "fields": [
                        {
                            component: componentTypes.SELECT,
                            name: 'boat',
                            initializeOnMount: true,
                            noValueUpdates: true,
                            helperText: "if you can't find your boat on the register, we will add it",
                            label: 'Boat Name',
                            isSearchable: true,
                            isClearable: true,
                            isRequired: true,
                            validate: [{ type: validatorTypes.REQUIRED }],
                            resolveProps: (props, { meta, input }, formOptions) => {

                                const m = formOptions.getFieldState('ddf.member_no');
                                const memberNo = m && Number(m.value);

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
                            component: componentTypes.TEXT_FIELD,
                            label: 'Add your boat name',
                            name: 'ddf.boatname',
                            condition: {
                                when: 'boat',
                                is: UNLISTED,
                            },
                            isRequired: true,
                            validate: [{ type: validatorTypes.REQUIRED }],
                        },
                    ],
                },
                {
                    component: 'paypal',
                    name: 'payment',
                    description: 'RBC 60 Sign-up with flag',
                    amount: 15,
                    label: 'Sign Up and Reserve your flag',
                    helperText: 'We are asking all skippers to reserve a flag up front for £15. This will help us know how many boats to plan for.',
                    validate: [{ type: validatorTypes.REQUIRED }],
                },
                {
                    component: componentTypes.SUB_FORM,
                    name: 'ddf.about.rbc',
                    title: "About your cruise",
                    fields: [
                        {
                            component: componentTypes.CHECKBOX,
                            name: 'rbc',
                            label: "I plan to take my boat all the way round",
                            initialValue: false,
                            dataType: dataTypes.BOOLEAN,
                        },
                        {
                            component: componentTypes.RADIO,
                            name: 'scotland',
                            label: "Which Route will you take?",
                            helperText: 'You can make a final decision later',
                            initialValue: 'Cape Wrath',
                            resolveProps: (props, { meta, input }, formOptions) => {
                                const rbc = formOptions.getFieldState('rbc');
                                const options = [
                                    { label: 'I will probably go through the Caledonian Canal', value: 'Caledonian Canal' },
                                    { label: 'I will probably go via Cape Wrath', value: 'Cape Wrath' },
                                ];
                                if (rbc && rbc.value) {
                                    return { options };
                                } else {
                                    return {
                                        options: [...options, { label: "I probably won't do this part of the cruise", value: 'neither' }],
                                    }
                                }
                            },
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
                            name: 'ddf.ports1',
                            label: "Please check all the 'party' ports you plan to bring your boat to.",
                            variant: 'h6',
                            sx: { marginTop: ".5em" }
                        },
                        {
                            component: componentTypes.CHECKBOX,
                            name: 'crew',
                            label: 'If you want to offer crewing opportunities for any of the legs, check here',
                            helperText: "You don't need to decide now, just leave the box unchecked if you haven't decided yet",
                            dataType: dataTypes.BOOLEAN,
                        },
                        ...portFields(ports, ''),
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
                        },
                    ],
                },
                {
                    component: componentTypes.TEXT_FIELD,
                    isReadOnly: true,
                    name: 'ddf.valid',
                    resolveProps: (props, { meta, input }, formOptions) => {
                        const countField = formOptions.getFieldState('ddf.count');
                        const count = countField && countField.value;
                        const boatNameField = formOptions.getFieldState('ddf.boatname');
                        const boatField = formOptions.getFieldState('boat');
                        let boat = 'your boat';
                        if (boatField && boatField.valid && boatField.value !== "My boat isn't listed") {
                            boat = boatField.value;
                        }
                        if (boatNameField && boatNameField.value) {
                            boat = boatNameField.value;
                        }
                        let flag = false;
                        const paypal = formOptions.getFieldState('payment');
                        if (paypal && paypal.value) {
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
                        If you are interested in bringing a boat to one of the OGA60 small boat events go to our <a href='https://oga.org.uk/oga60/small_boat_events.html'>Small Boat Events page</a>.
                    </Typography>
                    <Typography variant='body1'>
                        If you want more information about OGA60 in general go to the main <a href='https://oga.org.uk/oga60/oga60.html'>OGA60 page</a>.
                    </Typography>
                    <Typography variant='body1'>
                        Festivities are being arranged at each of the Party Ports around the country, and all OGA members and their boats are welcome at these, not only those taking part in the RBC.
                    </Typography>
                    <Typography variant='body1'>
                        These events are organised by the Areas and you will be able to register for them separately from the main <a href='https://oga.org.uk/events/events.html'>Events page</a>.
                    </Typography>
                </Grid>
                <Grid item xs={12}>
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
