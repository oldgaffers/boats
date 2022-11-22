import React from "react";
import { gql, useMutation } from '@apollo/client';
import { useAuth0 } from "@auth0/auth0-react";
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import FormTemplate from '@data-driven-forms/mui-component-mapper/form-template';
import componentMapper from "@data-driven-forms/mui-component-mapper/component-mapper";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Grid";

export default function OGA60({ onClose, onCancel }) {
    const [addInterest, result] = useMutation(gql`
    mutation addInterest($topic: String!, $member: Int!, $gold_id: Int!, $email: String!, $data: jsonb!) {
        insert_expression_of_interest(objects: {
            data: $data, email: $email, gold_id: $gold_id, member: $member, topic: $topic
        }){
          affected_rows
        }
      }      
    `);
    const { user, isAuthenticated } = useAuth0();

    if (result) {
        if (result.error) {
            alert('something went wrong - please email oga60@oga.org.uk and let us know how we can help.')
        }
    }

    let member;
    if (isAuthenticated && user) {
        member = user["https://oga.org.uk/member"];
    }

    const handleSubmit = (values) => {
        const { ddf, ...data } = values;
        addInterest({
            variables: {
                topic: 'OGA60',
                email: user.email, gold_id: user["https://oga.org.uk/id"], member: user["https://oga.org.uk/member"],
                data,
            }
        });
        onClose();
    };

    const schema = () => {
        return {
            fields: [
                {
                    name: 'ddf.user_name',
                    component: componentTypes.TEXT_FIELD,
                    hideField: true,
                    resolveProps: (props, { meta, input }, formOptions) => {
                        return { value: (user && (user.name || `${user.given_name} ${user.family_name})`)) || '' }
                    },
                },
                {
                    name: 'ddf.member',
                    component: componentTypes.TEXT_FIELD,
                    hideField: true,
                    resolveProps: (props, { meta, input }, formOptions) => {
                        return { value: member }
                    },
                },
                {
                    "component": componentTypes.SUB_FORM,
                    "title": "About you",
                    "name": "ddf.about.skipper",
                    "fields": [
                        {
                            component: componentTypes.PLAIN_TEXT,
                            name: 'ddf.show_member',
                            label: `We've identified you as {user.given_name} {user.family_name}, member ${member}`,
                            sx: { marginTop: "1em" },
                            condition: {
                                when: 'ddf.member',
                                isNotEmpty: true,
                            }
                        },
                        {
                            component: componentTypes.PLAIN_TEXT,
                            name: 'ddf.show_user',
                            label: `We've identified you as {user.given_name} {user.family_name}, but we haven't found your membership details.
                            You can still register interest and we will be in touch regarding your membership`,
                            sx: { marginTop: "1em" },
                            condition: {
                                and: [
                                    {
                                      when: 'ddf.member',
                                      isEmpty: true,
                                    },
                                    {
                                      when: 'ddf.user_name',
                                      isEmpty: false,
                                    }
                                  ]
                            }
                        },
                        {
                            component: componentTypes.TEXT_FIELD,
                            name: 'name',
                            label: 'Your name',
                            condition: {
                                when: 'ddf.user_name',
                                isEmpty: true,
                            }
                        },
                        {
                            component: componentTypes.TEXT_FIELD,
                            name: 'member',
                            label: 'Membership Number',
                            helperText: "If you can't remember your number we'll sort that out.",
                            condition: {
                                when: 'ddf.user_name',
                                isEmpty: true,
                            }
                        },
                        {
                            component: componentTypes.TEXT_FIELD,
                            name: 'email',
                            label: 'email',
                            helperText: "If you can't log in we will need an email address to contact you.",
                            condition: {
                                when: 'ddf.user_name',
                                isEmpty: true,
                            }
                        }
                    ]
                },
                {
                    component: componentTypes.SUB_FORM,
                    title: 'Your plans.',
                    name: 'boat',
                    fields: [
                        {
                            component: componentTypes.RADIO,
                            name: 'ddf.boat',
                            label: "Bringing a boat",
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
                            component: componentTypes.TEXT_FIELD,
                            name: 'boat_name',
                            label: 'Add your boat name if you would like to',
                            condition: {
                                when: 'ddf.boat',
                                is: 'none',
                                notMatch: true,
                            }
                        },
                        {
                            component: componentTypes.RADIO,
                            name: 'accomodation',
                            label: "Where we'll sleep",
                            initialValue: 'none',
                            options: [
                                { label: 'aboard my boat', value: 'aboard' },
                                { label: 'in a tent I\'ll bring', value: 'tent' },
                                { label: 'in a campervan I\'ll bring', value: 'campervan' },
                                { label: 'I won\'t be staying at the event site', value: 'none' },
                            ],
                        },
                        {
                            component: componentTypes.TEXT_FIELD,
                            name: 'party_size',
                            label: "Likely number of people in the group",
                            initialValue: 1,
                            type: 'number',
                            isRequired: true,
                            validate: [{ type: validatorTypes.REQUIRED }],
                        },
                    ]
                },
            ]
        };
    };

    /*
    Also I think it would be useful to add some explanatory text along the lines of ‘Our team on the East Coast are busy planning the OGA 60 celebrations, but it would be very helpful to have some early indication of interest, especially from those who might arrive without a boat (and might want to get afloat somehow or go for excursions in the area) and those who might bring a dinghy or small boat by trailer.  Please fill in the Expression of Interest form if you might come, to help us plan for you!  There will be a formal entry form later on once we have finalised plans etc.’  Perhaps this could go at the top of the Expression of Interest form, and also in the other OGA 60 page just before the link to the form?
    */

    return (
        <Paper>
            <Grid container spacing={2}>
                <Grid item xs={12}>
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
                <Grid item xs={12}>
                    <FormRenderer
                        schema={schema()}
                        subscription={{ values: true }}
                        componentMapper={{
                            ...componentMapper,
                        }}
                        FormTemplate={(props) => (
                            <FormTemplate {...props} buttonOrder={['cancel', 'submit']} />
                        )}
                        onSubmit={handleSubmit}
                        onCancel={() => onCancel()}
                    />
                </Grid>
            </Grid>
        </Paper>
    );
}
