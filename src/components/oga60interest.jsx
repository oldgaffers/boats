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
import Snackbar from "@mui/material/Snackbar";
import Grid from "@mui/material/Grid";
import LoginButton from './loginbutton';

let operation = 'insert_oga60_interest';
if (window.location.pathname.includes('beta') || window.location.hostname === 'localhost') {
    operation = 'insert_oga60_test';
}

export default function RBC60() {
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [addInterest, result] = useMutation(gql`
        mutation addInterest($data: jsonb!) {
        ${operation}(objects: {data: $data}) { affected_rows } }
    `);
    const { user, isAuthenticated } = useAuth0();

    let userState;

    if (result) {
        console.log('mutation', result);
        if (result.error) {
            alert('something went wrong - please email oga60@oga.org.uk and let us know how we can help.')
        }
    }

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
        addInterest({ variables: { data } });
        setSnackBarOpen(true);
    };

    const handleSnackBarClose = () => {
        setSnackBarOpen(false);
        // eslint-disable-next-line no-restricted-globals
        history.go(0);
    }

    const schema = () => {
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
                            component: componentTypes.RADIO,
                            name: 'ddf.member',
                            label: "I am a member of the OGA",
                            initialValue: 'non',
                            options: [
                                { label: 'I am a member of the OGA', value: 'oga' },
                                { label: 'I am a member of the Dutch OGA', value: 'dutch' },
                                { label: 'I am not currently a member', value: 'non' },
                            ],
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
                                is: 'oga',
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
                        {
                            component: componentTypes.RADIO,
                            name: 'ddf.joining',
                            label: 'If you are not a member and would like to join RBC60, we will add a 12 month membership for 2023 to your registration fee.',
                            helperText: 'Choose your class of membership. Juniors must be under 25 on 1st January 2023',
                            initialValue: 'ind',
                            options: [
                                { label: 'Individual member - £33', value: 'ind' },
                                { label: 'Family member - £38', value: 'fam' },
                                { label: 'Junior - £5.50', value: 'jun' },
                            ],   
                            condition: {
                                when: 'ddf.member',
                                is: 'non',
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
                            component: componentTypes.SUB_FORM,
                            name: 'ddf.ecc',
                            title: "East Coast annual Summer Cruise",
                            fields: [
                                {
                                    component: componentTypes.CHECKBOX,
                                    name: 'ecc',
                                    label: "I'd like to bring my boat along to the East Coast Summer Cruise",
                                    dataType: dataTypes.BOOLEAN,
                                    helperText: "The East Coast annual Summer Cruise will head south after the main OGA 60 celebration.",

                                },        
                            ],
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
                    component: componentTypes.PLAIN_TEXT,
                    name: 'ddf.no_ports_no_boat',
                    label: 'To register, please tell us about your boat and check one or more ports',
                    variant: 'h6',
                    sx: { marginTop: "1em" },
                    condition: {
                        and: [
                            {
                                when: 'ddf.count',
                                is: 0,
                            },
                            {
                                not: validBoatName,
                            }
                        ],
                    }
                },
                {
                    component: componentTypes.PLAIN_TEXT,
                    name: 'ddf.no_ports',
                    label: 'To register, please check one or more ports',
                    variant: 'h6',
                    sx: { marginTop: "1em" },
                    condition: {
                        and: [
                            {
                                when: 'ddf.count',
                                is: 0,
                            },
                            validBoatName
                        ],
                    }
                },
                {
                    component: componentTypes.PLAIN_TEXT,
                    name: 'ddf.no_boat',
                    label: 'To register, please tell us about your boat',
                    variant: 'h6',
                    sx: { marginTop: "1em" },
                    condition: {
                        and: [
                            {
                                when: 'ddf.count',
                                greaterThan: 0,
                            },
                            {
                                not: validBoatName,
                            }
                        ],
                    }
                },
                {
                    component: 'paypal',
                    name: 'payment',
                    label: 'Register',
                    condition: {
                        and: [
                            {
                                when: 'ddf.count',
                                greaterThan: 0,        
                            },
                            validBoatName,
                        ],
                    },
                    resolveProps: (props, { meta, input }, formOptions) => {
                        console.log(props);
                        console.log(input);
                        const m = formOptions.getFieldState('ddf.member');
                        const purchaseUnits = [
                            {
                                description: 'RBC 60 Sign-up with flag',
                                amount: { currency_code: 'GBP', value: 15 },
                                reference_id: 'rbc60',
                            }
                        ];
                        let helperText = '£15 to register'
                        if (m && !m.value) {
                            console.log('not member');
                            const j = formOptions.getFieldState('ddf.joining');
                            if (j) {
                                console.log('joining', j.value);
                                const pu = {
                                    'ind': {
                                        description: '12m individual membership',
                                        amount: { currency_code: 'GBP', value: 33 },
                                        reference_id: 'ind',
                                    },
                                    'fam': {
                                        description: '12m family membership',
                                        amount: { currency_code: 'GBP', value: 38 },
                                        reference_id: 'fam',
                                    },
                                    'jun': {
                                        description: '12m junior membership',
                                        amount: { currency_code: 'GBP', value: 5.5 },
                                        reference_id: 'jun',
                                    },
                                }[j.value];
                                purchaseUnits.push(pu);
                                helperText = `${new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(15+pu.amount.value)} to join for 12 months and register`    
                            }
                        }
                        if (input.value) {
                            helperText = `You have paid ${helperText}`
                        } else {
                            helperText = `You are paying ${helperText}`
                        }
                        console.log(purchaseUnits);
                        return { purchaseUnits, helperText };
                    },
                },
            ]
        };
    };

    return (
        <Paper>
            <Grid container spacing={2}>
                <Grid item xs={10}>
                    <Typography paragraph={true} variant='body1'>
                        {user ? `Hello ${user.given_name || user.name}. ` : ''}
                        This form is for OGA members to express interest in attending the main OGA60 celebration at Suffolk Yacht Harbour.
                    </Typography>
                    <Typography paragraph={true} variant='body1'>
                        If you are interested in joining all or part of the RBC60 with your own boat go to our <a href="/oga60/rbc60_registration.html" target="_self">RBC Registration</a> page.
                    </Typography>
                    <Typography paragraph={true} variant='body1'>
                        If you are interested in joining all or part of the RBC60 on someone else's boat go to our <a href='/oga60/rbc60_crewing_opportunities.html'>Crewing page</a>.
                    </Typography>
                    <Typography paragraph={true} variant='body1'>
                        If you are interested in bringing a boat to one of the OGA60 small boat events, or if you want more information about OGA60 in general go to the main <a href='/oga60/oga60.html'>OGA60 page</a>.
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <LoginButton label='Member Login'/>
                </Grid>
                <Grid item xs={12}>
                    <FormRenderer
                        schema={schema()}
                        subscription={{ values: true }}
                        componentMapper={{
                            ...componentMapper,
                        }}
                        FormTemplate={(props) => (
                            <FormTemplate {...props} showFormControls={true} />
                        )}
                        onSubmit={handleSubmit}
                    />
                </Grid>
            </Grid>
            <Snackbar
                sx={{backgroundColor: 'green'}}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={snackBarOpen}
                autoHideDuration={5000}
                onClose={handleSnackBarClose}
                message="Thanks for registering. You should receive an email to say we have your details."
                severity="success"
            />
        </Paper>
    );
}
