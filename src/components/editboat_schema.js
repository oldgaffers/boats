import React from 'react';
import validatorTypes from "@data-driven-forms/react-form-renderer/validator-types";
import BoatIcon from "./boaticon";
import BoatAnchoredIcon from "./boatanchoredicon";
import { dimensionsForm } from "./Dimensions";
import { rigForm } from "./Rig";
import {
  homeItems, descriptionsItems,
  registrationForm, constructionForm,
  yachtHullStep, dinghyHullStep, referencesItems
} from "./ddf/SubForms";
import { steps as handicap_steps } from "./Handicap";
import { Typography } from '@mui/material';

function intField(name, label) {
  return { name, label, 
    component: "text-field", type: "number", dataType: 'integer',
  };
}

export const schema = (pickers, canBuySell, forSale) => {
  const activities = [
    { label: "Edit the short and full descriptions", value: "descriptions" },
    { label: "Edit MSSI, sail number, etc.", value: "registrations" },
    { label: "Edit Design & Build", value: "construction" },
    { label: "Edit Dimensions", value: "dimensions" },
    { label: "Edit Rig & Sails (or get a handicap)", value: "rig" },
    { label: "Edit Home Port and Previous Names", value: "misc" },
    { label: "Add or update current or previous owners", value: "own" },
  ];
  if (canBuySell) {
    if (forSale) {
      activities.push({ label: 'Change Sales Status', value: 'update-sell' });
    } else {
      activities.push({ label: 'Put up for sale', value: 'sell' });
    }
  }
  return {
    fields: [
      {
        component: 'wizard',
        name: 'boat',
        fields: [
          {
            name: "activity-step",
            nextStep: ({ values }) => `${values?.ddf?.activity || 'descriptions'}-step`,
            fields: [
              {
                name: "activity",
                component: 'sub-form',
                title: "Update Boat",
                description: "Choose one of the options and then click CONTINUE. "
                  + " After each section you will be able to submit or carry on. "
                  + "Once we have your proposed changes we'll review them and contact you "
                  + "if we have any questions",
                fields: [
                  {
                    component: 'text-field',
                    name: "ddf.canBuySell",
                    label: "can buy/sell",
                    hideField: true,
                  },
                  {
                    component: 'text-field',
                    name: "selling_status",
                    label: "selling_status",
                    hideField: true,
                  },
                  {
                    component: 'text-field',
                    name: "ddf.email",
                    label: "email",
                    hideField: true,
                  },
                  {
                    component: 'text-field',
                    name: "email",
                    label: "your email",
                    condition: { when: 'ddf.email', isEmpty: true },
                    resolveProps: (props, { meta, input }, formOptions) => {
                      const s = formOptions.getState();
                      if (s.values?.ddf?.email) {
                        return {
                          isHidden: true,
                        };
                      }
                      return {
                        isRequired: true,
                        validate: [
                          { type: validatorTypes.REQUIRED },
                          {
                            type: validatorTypes.PATTERN,
                            pattern: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
                          }
                        ]
                      }
                    },
                  },
                  {
                    component: 'radio',
                    name: "ddf.activity",
                    label: "What would you like to do first?",
                    options: activities,
                    initialValue: 'descriptions',
                    isRequired: true,
                    validate: [{ type: 'required' }],
                    RadioProps: {
                      icon: <BoatAnchoredIcon color="primary" />,
                      checkedIcon: <BoatIcon color="primary" />,
                    },
                  },
                ],
              },
            ],
          },
          {
            name: "descriptions-step",
            component: 'sub-form',
            shortcut: true,
            nextStep: "registrations-step",
            title: "Edit Descriptions",
            fields: descriptionsItems,
          },
          {
            name: "registrations-step",
            component: 'sub-form',
            shortcut: true,
            nextStep: "construction-step",
            fields: [registrationForm],
          },
          {
            name: "construction-step",
            component: 'sub-form',
            shortcut: true,
            nextStep: "dimensions-step",
            fields: [constructionForm(pickers)],
          },
          {
            name: "dimensions-step",
            component: 'sub-form',
            nextStep: ({ values }) => (values.generic_type === 'Dinghy') ? 'dinghy-hull-step' : 'yacht-hull-step',
            fields: [dimensionsForm],
          },
          yachtHullStep("rig-step"),
          dinghyHullStep("rig-step"),
          {
            name: "rig-step",
            component: 'sub-form',
            shortcut: true,
            nextStep: "handicap-step",
            fields: [rigForm(pickers)]
          },
          ...handicap_steps('own-step'),
          {
            name: "own-step",
            component: 'sub-form',
            nextStep: "misc-step",
            shortcut: true,
            // fields: [ownershipUpdateForm],
            fields: [
              {
                component: 'plain-text',
                name: 'ddf.ownerships_label',
                label: 'You can add, remove and edit ownership records on this page.'
                  + ' If you are listed as a current owner and this is no-longer true add an end year and uncheck the box.'
                  + ' Your changes will be send to the editors who will update the boat\'s record'
              },
              {
                component: 'field-array',
                name: "ownerships",
                label: "Known Owners",
                fields: [
                  { name: 'name', label: 'Name', component: 'text-field', isRequired: true, validate: [{ type: 'required' }], },
                  {
                    ...intField('start', 'Start Year'),
                    isRequired: true,
                    validate: [{ type: 'required' }],
                  },
                  intField('end', 'End Year'),
                  {
                    ...intField('share', 'Share (64ths)'),
                    initialValue: 64,
                    isRequired: true,
                    validate: [{ type: 'required' }],
                  },
                  { name: 'current', label: 'Current', component: 'checkbox' },
                ],
              },
            ]
          },
          {
            name: "misc-step",
            title: <Typography variant='h5'>Home Port and Previous Names</Typography>,
            component: 'sub-form',
            nextStep: "references-step",
            fields: [
              ...homeItems,
              {
                component: 'field-array',
                name: "previous_names",
                label: "Previous names",
                fields: [{ component: "text-field" }],
              },
            ],
          },
          {
            name: "references-step",
            title: <Typography paddingBottom={2} variant='h5'>References</Typography>,
            component: 'sub-form',
            nextStep: ({ values }) => {
              if (values?.ddf?.canBuySell) {
                switch (values.selling_status) {
                  case 'for_sale':
                    return 'price-step';
                  case 'not_for_sale':
                    return 'sell-step';
                  default:
                    return 'done-step';
                }
              } else {
                return 'done-step';
              }
            },
            fields: referencesItems,
          },
          {
            name: "sell-step",
            title: <Typography variant='h5'>Put Boat For Sale</Typography>,
            component: 'sub-form',
            shortcut: true,
            nextStep: "done-step",
            fields: [
              {
                component: 'text-field',
                name: "ddf.price",
                label: "Price (pounds)",
                type: "number",
                dataType: 'float',
                isRequired: true,
                validate: [{ type: 'required' }],
              },
              {
                component: "html",
                title: "Sales Text",
                name: "ddf.sales_text",
                controls: ["bold", "italic"],
                maxLength: 500,
                isRequired: true,
                validate: [{ type: 'required' }],
              },
              {
                component: 'checkbox',
                label: 'I want to sell this boat',
                name: 'ddf.confirm_for_sale',
                helperText: 'please confirm you want to put this boat up for sale',
                isRequired: true,
                validate: [{ type: 'required' }],
              },
            ],
          },
          {
            title: <Typography variant='h5'>Change Sales Status</Typography>,
            name: "update-sell-step",
            component: 'sub-form',
            nextStep: {
              when: "ddf.update_sale",
              stepMapper: {
                'update': "update-sales-data-step",
                'sold': "sold-step",
                'unsell': "done-step",
              },
            },
            fields: [
              {
                component: 'radio',
                options: [
                  { label: 'I want to take boat off the market for the present', value: 'unsell', },
                  { label: "I've sold the boat", value: 'sold', },
                  { label: "I want to update the price or sales text", value: 'update', },
                ],
                initialValue: 'update',
                name: 'ddf.update_sale',
                isRequired: true,
                validate: [{ type: 'required' }],
              },
            ],
          },
          {
            title: <Typography variant='h5'>Update Sales Data</Typography>,
            name: "update-sales-data-step",
            component: 'sub-form',
            nextStep: "done-step",
            shortcut: true,
            fields: [
              {
                component: 'text-field',
                name: "ddf.price",
                label: "New Price (pounds)",
                type: "number",
                dataType: 'float',
              },
              {
                component: 'html',
                name: "ddf.sales_text",
                controls: ["bold", "italic"],
                maxLength: 500,
                title: "Updated Sales Text",
              },
            ],
          },
          {
            name: "sold-step",
            title: <Typography variant='h5'>Congratulations on Selling your boat</Typography>,
            component: 'sub-form',
            nextStep: "done-step",
            shortcut: true,
            fields: [
              {
                component: "date-picker",
                label: 'Date Sold',
                name: 'ddf.date_sold',
                isRequired: true,
                initialValue: new Date(),
                validate: [{ type: 'required' }],
              },
              {
                component: 'text-field',
                name: "ddf.sale_price",
                label: "Final Price (pounds)",
                type: "number",
                dataType: 'float',
                isRequired: true,
                validate: [{ type: 'required' }],
              },
              {
                component: "html",
                title: <Typography>Please add some details,
                <br/>including the new owner's name, 
                <br/>if they are happy to share, and whether
                <br/>the Boat Register or
                Gaffer's Log helped with the sale.</Typography>,
                name: "ddf.summary",
                controls: ["bold", "italic"],
                maxLength: 500,
                isRequired: true,
                validate: [{ type: 'required' }],
              },
            ],
          },
          {
            name: "done-step",
            component: 'sub-form',
            fields: [
              {
                name: "ddf.we_are_done",
                component: 'plain-text',
                label:
                  "Thanks for helping make the register better. The editor's will review your suggestions.",
              },
            ],
          },
        ],
      },
    ],
  }
};
