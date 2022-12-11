import React from 'react';
import validatorTypes from "@data-driven-forms/react-form-renderer/validator-types";
import BoatIcon from "./boaticon";
import BoatAnchoredIcon from "./boatanchoredicon";
import { dimensionsForm } from "./Dimensions";
import { rigForm } from "./Rig";
import {
  summaryForm, descriptionsForm,
  registrationForm, constructionForm,
  yachtHullStep, dinghyHullStep
} from "./ddf/SubForms";
import { steps as handicap_steps } from "./Handicap";
import { Typography } from '@mui/material';

export const CLEARED_VALUE = '[remove]';

export const schema = (pickers, canBuySell, forSale) => {
  const activities = [
    { label: "Edit the short and full descriptions", value: "descriptions" },
    { label: "Edit MSSI, sail number, etc.", value: "registrations" },
    { label: "Edit Design & Build", value: "construction" },
    { label: "Edit Dimensions", value: "dimensions" },
    { label: "Edit Rig & Sails (or get a handicap)", value: "rig" },
    { label: "Edit other fields", value: "summary" },
    { label: "Add or update current or previous owners", value: "own" },
  ];
  if (canBuySell) {
    if (forSale) {
      activities.push({ label: 'Change Price', value: 'price' });
      activities.push({ label: 'Set sold', value: 'sold' });
      activities.push({ label: 'Set not for sale', value: 'unsell' });
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
            fields: [descriptionsForm],
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
            nextStep: "summary-step",
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
                  { name: 'name', label: 'Name', component: "text-field" },
                  { name: 'start', label: 'Start', component: "text-field" },
                  { name: 'end', label: 'End', component: "text-field" },
                  { name: 'share', label: 'Share (64ths)', component: "text-field" },
                  { name: 'current', label: 'Current', component: 'checkbox' },
                ],
              },
            ]
          },
          {
            name: "summary-step",
            component: 'sub-form',
            nextStep: "references-step",
            fields: [summaryForm(pickers)],
          },
          {
            name: "references-step",
            component: 'sub-form',
            nextStep: ({ values }) => {
              console.log('PROPS', values.ddf);
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
            fields: [
              {
                component: 'field-array',
                name: "reference",
                label: "References in Gaffers Log, etc.",
                fields: [{ component: "text-field" }],
              },
            ],
          },
          {
            name: "sell-step",
            title: <Typography variant='h5'>Put Boat For Sale</Typography>,
            component: 'sub-form',
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
            title: <Typography variant='h5'>Update the Price</Typography>,
            name: "price-step",
            component: 'sub-form',
            nextStep: "done-step",
            fields: [
              {
                component: 'text-field',
                name: "ddf.price",
                label: "New Price (pounds)",
                type: "number",
                dataType: 'float',
                isRequired: true,
                validate: [{ type: 'required' }],
              },
            ],
          },
          {
            title: <Typography variant='h5'>Remove from Sale</Typography>,
            name: "unsell-step",
            component: 'sub-form',
            nextStep: "done-step",
            fields: [
              {
                component: 'checkbox',
                label: 'I want to take boat off the market for the present',
                name: 'ddf.confirm_not_for_sale',
                isRequired: true,
                validate: [{ type: 'required' }],
              },
            ],
          },
          {
            name: "sold-step",
            title: <Typography variant='h5'>Congratulations on Selling your boat</Typography>,
            component: 'sub-form',
            nextStep: "done-step",
            fields: [
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
                title: "Notes",
                helperText: `please add some details, including the new owner's name, 
                if they are happy to share`,
                name: "ddf.summary",
                controls: ["bold", "italic"],
                maxLength: 500,
                isRequired: true,
                validate: [{ type: 'required' }],
              },
              {
                component: "date-picker",
                label: 'Date Sold',
                name: 'ddf.date_sold',
                isRequired: true,
                initialValue: new Date(),
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
