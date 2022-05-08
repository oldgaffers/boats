import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useAuth0 } from "@auth0/auth0-react";
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
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

export default function OGA60() {
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

    const handleSubmit = (values) => {
        const { ddf, ...data } = values;

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
                            component: componentTypes.SUB_FORM,
                            title: 'Contact Details',
                            name: 'ddf.non',
                            fields: [
                                {
                                component: componentTypes.TEXT_FIELD,
                                name: 'ddf.name',
                                label: "Name",
                                isRequired: true,
                                validate: [{ type: validatorTypes.REQUIRED }],
                                },
                                {
                                    component: componentTypes.TEXT_FIELD,
                                    name: 'ddf.email',
                                    helperText: 'Give us your email address and we will keep you up-to-date on plans for the event.',
                                    label: "Email",
                                    isRequired: true,
                                    validate: [{ type: validatorTypes.REQUIRED }],
                                }                 
                            ],   
                            condition: {
                                'or': [
                                    { when: 'ddf.member', is: 'dutch' },
                                    { when: 'ddf.member', is: 'non' },
                                ],
                            },
                        },
                        {
                                component: componentTypes.SUB_FORM,
                                title: 'Your plans.',
                                name: 'ddf.attend',
                                fields: [
                                    {
                                        component: componentTypes.RADIO,
                                        name: 'ddf.boat',
                                        label: "Boat",
                                        initialValue: 'none',
                                        options: [
                                            { label: 'I\'m attending as part of the Round Britain Cruise', value: 'rbc' },
                                            { label: 'I\'m attending as part of the Cross Britain fleet', value: 'cross' },
                                            { label: 'I\'ll be bringing my cruising yacht', value: 'yacht' },
                                            { label: 'I\'ll be bringing a boat on a trailer by road', value: 'trailer' },
                                            { label: 'I won\'t be bringing a boat', value: 'none' },
                                        ],
                                    },
                                    {
                                        component: componentTypes.RADIO,
                                        name: 'ddf.accomodation',
                                        label: "Ashore",
                                        initialValue: 'none',
                                        options: [
                                            { label: 'I won\'t be staying at the event site', value: 'none' },
                                            { label: 'I\'d like to bring a tent.', value: 'tent' },
                                            { label: 'I\'d like to bring a campervan', value: 'campervan' },
                                        ],
                                    },
                                    {
                                    component: componentTypes.TEXT_FIELD,
                                    name: 'ddf.group',
                                    label: "Likely number of people in the group",
                                    type: 'number',
                                    isRequired: true,
                                    validate: [{ type: validatorTypes.REQUIRED }],
                                    },
                                ]
                            /*
 

Expected number of crew

 
                            */
                        },
                    ]
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
                        This form is for OGA members to express interest in attending the main OGA60 celebration at Ipswich & Levington.
                        Please submit one form per group of people, either crewing on a boat or travelling together.
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
