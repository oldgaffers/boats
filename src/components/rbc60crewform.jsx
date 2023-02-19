import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import FormTemplate from '@data-driven-forms/mui-component-mapper/form-template';
import componentMapper from "@data-driven-forms/mui-component-mapper/component-mapper";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Snackbar from "@mui/material/Snackbar";
import Grid from "@mui/material/Grid";
import LoginButton from './loginbutton';
import { postCrewEnquiry } from "./boatregisterposts";

const TwoColumns = ({ fields }) => {
    const { renderForm } = useFormApi();
  
    return (
      <Grid container spacing={2} justifyContent="space-around">
        {fields.map((field) => (
          <Grid key={field.name} item xs={6}>
            {renderForm([field])}
          </Grid>
        ))}
      </Grid>
    );
};

const ports = [
    { name: 'Ramsgate', start: '2023-04-27', end: '2023-05-01' },
    { name: 'Cowes', start: '2023-05-06', end: '2023-05-07' },
    { name: 'Plymouth', start: '2023-05-10', end: '2023-05-11' },
    { name: 'Milford Haven', start: '2023-05-20', end: '2023-05-21' },
    { name: 'Dublin', start: '2023-05-27', end: '2023-05-28' },
    { name: 'Oban', start: '2023-06-17', end: '2023-06-18' },
    { name: 'Arbroath', start: '2023-07-15', end: '2023-07-16', via: { routeName: 'scotland', choices: ['Caledonian Canal', 'Cape Wrath'] } },
    { name: 'Blyth', start: '2023-07-21', end: '2023-07-24' },
    { name: 'OGA60, Suffolk Yacht Harbour, River Orwell', start: '2023-08-02', end: '2023-08-06' },
];

const startDate = ({start, end}) => {
    if (start) {
        const st = new Date(start);
        const s = new Intl.DateTimeFormat('en-GB', { month: 'short', day: 'numeric' }).format(st);
        if (end) {
            const ed = new Date(end);
            const e = new Intl.DateTimeFormat('en-GB', { month: 'short', day: 'numeric' }).format(ed);
            return e;
        }
        return s;
    }
    return '';
}

const crewlegfield = (name, label, routeName) => {
    return {
        component: componentTypes.CHECKBOX,
        name: `leg.${name}`,
        label: label,
        dataType: 'boolean',
    };
};

const portFields = (ports, route) => {
    const fields = [];
    ports.forEach(({ name, start, end, via }, index, list) => {
        if (index > 0) {
            if (via) {
                fields.push(...via.choices.map((leg) => crewlegfield(leg, leg, via.routeName)));
            } else {
                const legName = `${list[index - 1].name}_${name}`;
                const label = `The ${list[index - 1].name} - ${name} leg starting ${startDate(list[index-1])}`;
                fields.push(crewlegfield(legName, label));
            }
        }
    });
    return fields;
};

export default function RBC60CrewForm() {
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const { user, isAuthenticated } = useAuth0();

    let userState;

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

    const handleSubmit = (values) => {
        // console.log('submit', values);
        const { ddf, ...data } = values;
        postCrewEnquiry(data).then(
            () => setSnackBarOpen(true)
        ).catch((error => console.log(error)));
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
                    component: componentTypes.SUB_FORM,
                    title: "About you",
                    name: "ddf.about.crew",
                    fields: [
                        {
                            component: componentTypes.TEXT_FIELD,
                            name: 'user',
                            isReadOnly: true,
                            hideField: true,
                            label: 'USER',
                            initialValue: user || 'NONE',
                        },
                        {
                            component: componentTypes.TEXT_FIELD,
                            label: 'Type of login',
                            name: 'ddf.userState',
                            isReadOnly: true,
                            hideField: true,
                            initialValue: userState,
                        },
                        {
                        name: 'layout',
                        component: 'two-columns',
                        fields: [
                            {
                                component: componentTypes.PLAIN_TEXT,
                                name: 'ddf.show_user',
                                label: (<Typography>We've identified you as {user ? user.given_name : ''} {user ? user.family_name : '-'}. This form is for members. you can do so by taking out a 12 month membership for 2023 <a href="https://oga.org.uk/about/membership.html">here</a>.</Typography>),
                                condition: {
                                    when: 'ddf.userState',
                                    is: 'user',
                                },
                            },
                            {
                                component: componentTypes.PLAIN_TEXT,
                                name: 'ddf.show_member',
                                label: `We've identified you as ${user ? user.given_name : ''} ${user ? user.family_name : '-'}, member ${member}.`,
                                condition: {
                                    when: 'ddf.userState',
                                    is: 'member',
                                },
                            },
                            {
                                component: componentTypes.PLAIN_TEXT,
                                name: 'ddf.show_login',
                                label: <>If you are a member please <LoginButton label='login' /></>,
                                condition: {
                                    when: 'ddf.userState',
                                    is: 'not logged in',
                                },
                                sx: { marginTop: ".8em" }
                            },
                            {
                                component: componentTypes.TEXT_FIELD,
                                name: 'email',
                                label: 'Otherwise enter your email address here',
                                condition: {
                                    when: 'ddf.userState',
                                    is: 'not logged in',
                                },
                            },
                            ],
                            sx: { marginTop: "1em" }
                        },
                        {
                            component: componentTypes.CHECKBOX,
                            name: 'adult',
                            label: "I confirm I'm over 18",
                            initialValue: false,
                            isRequired: true,
                            validate: [
                                { type: validatorTypes.REQUIRED },
                                (value) => !value,
                            ],
                            resolveProps: (props, { meta, input }, formOptions) => {
                                // console.log(input);
                            },
                        },
                        {
                            component: componentTypes.TEXTAREA,
                            name: 'experience',
                            label: 'Tell us about your level of sailing skills',
                            minRows: 3,
                        },
                        {
                            component: componentTypes.TEXTAREA,
                            name: 'pitch',
                            label: 'Tell us what you would bring to the cruise and what you hope to get out of it',
                            minRows: 3,
                        },
                    ]
                },
                {
                    component: componentTypes.SUB_FORM,
                    name: 'ddf.tick',
                    title: 'Check all the legs you are interested in',
                    fields: [...portFields(ports, '')],
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
                        This page is for OGA members (including members of the Dutch OGA) to register interest in joining all or part of the OGA 60 Round Britain Cruise (RBC60) as crew.
                    </Typography>
                    <Typography paragraph={true} variant='body1'>
                        If you are interested in joining all or part of the cruise with your own boat go to our <a href="/oga60/rbc60_registration.html" target="_self">RBC Registration</a> page.
                    </Typography>
                    <Typography paragraph={true} variant='body1'>
                        If you are interested in bringing a boat to one of the OGA60 small boat events, or if you want more information about OGA60 in general go to the main <a href='/oga60/oga60.html'>OGA60 page</a>.
                    </Typography>
                    <Typography paragraph={true} variant='body1'>
                        Festivities are being arranged at each of the Party Ports around the country, and all OGA members and their boats are welcome at these, not only those taking part in the RBC.
                        These events are organised by the Areas and you will be able to register for them separately from the main <a href='/events/events.html'>Events page</a>.
                    </Typography>
                    <Typography paragraph={true} variant='body1'>
                        Some RBC60 skippers may be interested in additional crew.
                    </Typography>
                    <Typography paragraph={true} variant='body1'>
                        This may be to help short-handed skippers in more difficult areas or just to enjoy the company of additional crew members.
                    </Typography>
                    <Typography paragraph={true} variant='body1'>
                        If you have skills you think may be useful, or if you are new to sailing and would love to try it you are welcome to register interest.
                    </Typography>
                    <Typography paragraph={true} variant='body1'>
                        Acceptance of crews is entirely up to the skipper.
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <LoginButton label='Member Login' />
                </Grid>
                <Grid item xs={12}>
                    <FormRenderer
                        schema={schema(ports)}
                        subscription={{ values: true }}
                        componentMapper={
                            { ...componentMapper, 'two-columns': TwoColumns }
                        }
                        FormTemplate={(props) => (
                            <FormTemplate {...props} showFormControls={true} />
                        )}
                        onSubmit={handleSubmit}
                    />
                </Grid>
            </Grid>
            <Snackbar
                sx={{ backgroundColor: 'green' }}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={snackBarOpen}
                autoHideDuration={5000}
                onClose={handleSnackBarClose}
                message="Thanks for registering. You should receive an email, acknowleging your interest."
                severity="success"
            />
        </Paper>
    );
}
