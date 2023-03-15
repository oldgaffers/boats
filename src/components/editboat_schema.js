import React from 'react';
import validatorTypes from "@data-driven-forms/react-form-renderer/validator-types";
import BoatIcon from "./boaticon";
import BoatAnchoredIcon from "./boatanchoredicon";
import { dimensionsForm } from "./Dimensions";
import { rigForm } from "./Rig";
import {
  homeItems, descriptionsItems,
  registrationForm, constructionForm,
  yachtHullStep, dinghyHullStep, referencesItems, ownerShipsForm, salesSteps, preSalesStep
} from "./ddf/SubForms";
import { steps as handicap_steps } from "./Handicap";
import { Typography } from '@mui/material';

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
          ownerShipsForm('own-step', 'misc-step'),
          {
            name: "misc-step",
            title: <Typography variant='h5'>Home Port and Previous Names</Typography>,
            component: 'sub-form',
            shortcut: true,
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
          preSalesStep('sell-step', 'done-step'),
          ...salesSteps('update-sell-step', 'done-step'),
          {
            name: "done-step",
            component: 'sub-form',
            shortcut: true,
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
