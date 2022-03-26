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

const DDFPayPalButtons = ({ component, name, label }) => {
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
        <Typography variant="h4" sx={{ paddingTop: "1em" }}>{label}</Typography>
        <PayPalButtons style={{
            shape: 'rect',
            color: 'blue',
            layout: 'vertical',
            label: 'paypal',
            }}
            createOrder={createOrder}
            onApprove={approve}
        />
        <div></div>
      </Box>
    );
  };
  
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

const legfield = (name, label) => {
    return { 
        component: componentTypes.TEXT_FIELD,
        name: name,
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
            value: 'select-none',
            selectNone: true,
        },
        ...pickers.boat.map((boat) => {
            const text = `${boat.name} (${boat.oga_no})`;
            return { label: text, value: text };
        }).sort((a, b) => a.label > b.label )
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
                    fields.push(legfield(`${list[index-1].name}_${name}`, `${list[index-1].name} - ${name}`));
                }
            }
            fields.push({ 
                component: componentTypes.CHECKBOX,
                name: name,
                label: port(name, start, end),
                dataType: dataTypes.BOOLEAN,
            });
        });
        return {
            fields: [
                {
                    component: 'paypal',
                    name: 'payment',
                    label: 'Register Interest and reserve your flag',
                },
                {
                    component: componentTypes.PLAIN_TEXT,
                    name: 'ddf.about',
                    label: "Tell us about you and your boat",
                    variant: 'h4',
                },
                { 
                    component: componentTypes.SELECT,
                    name: 'boat',
                    helperText: "if you can't find your boat on the register, we will add it",
                    label: 'Boat Name',
                    options: boatOptions,
                    isSearchable: true,
                }, 
                {
                    component: componentTypes.PLAIN_TEXT,
                    name: 'ddf.np',
                    label: "The boat register editors will be in touch to get your boat added",
                    condition: {
                        when: 'boat',
                        is: 'select-none',
                    },
                },
                { 
                    component: componentTypes.TEXT_FIELD,
                    name: 'skipper_email',
                    helperText: 'this ought to be auto-filled with the email of the logged-in user',
                    label: 'Email',
                },
                { 
                    component: componentTypes.PLAIN_TEXT,
                    name: 'ddf.ports1',
                    label: "Please check all the 'party' ports you plan to bring your boat to.",
                    variant: 'h4',
                },
                { 
                    component: componentTypes.PLAIN_TEXT,
                    name: 'ddf.ports2',
                    label: 'If you can offer crewing opportunities for any of the legs please indicate how many spaces you might have',
                    // variant: 'h4',
                },
                ...fields,       
            ]
        };
    };

    return (
        <Paper>
            <Typography variant='h3'>OGA Round Britain Cruise 2023 - RBC60</Typography>
            <Typography variant='body2'>The RBC starts at Ramsgate on 27 April 2023 and OGA members are welcome to join at any stage for part of the cruise or the whole circumnavigation. Festivities are being arranged at each of the Party Ports around the country, and all OGA members and their boats are welcome at these, not only those taking part in the RBC.  The ports and dates listed are the confirmed Party Ports.
                Please tick the boxes to indicate which ports you plan to visit. If you intend to complete the whole circumnavigation starting at Ramsgate then tick all.
            </Typography>
            <FormRenderer
                schema={schema(ports)}
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
        </Paper>
    );
}
