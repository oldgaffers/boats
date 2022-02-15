import React from "react";
import { useLazyQuery, gql } from '@apollo/client';
import { FormRenderer, componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import {
  componentMapper,
  FormTemplate,
} from "@data-driven-forms/mui-component-mapper";
import BoatIcon from "./boaticon";
import BoatAnchoredIcon from "./boatanchoredicon";
import { HtmlEditor } from "./ddf/RTE";
// const BoatIcon = React.lazy(() => import("./boaticon"));
// const BoatAnchoredIcon = React.lazy(() => import("./boatanchoredicon"));
// const { HtmlEditor } = React.lazy(() => import("./ddf/RTE"));

export const schema = () => {
  return {
    fields: [
      {
        component: componentTypes.WIZARD,
        name: "boat",
        fields: [
          {
            name: "activity-step",
            nextStep: ({ values }) => `${values.ddf.activity}-step`,
            fields: [
              {
                name: "activity",
                component: componentTypes.SUB_FORM,
                title: "Admin Options",
                description: "Choose one of the options and then click CONTINUE.",
                fields: [
                  {
                    component: componentTypes.RADIO,
                    name: "ddf.activity",
                    label: "What would you like to do?",
                    options: [
                      { label: 'feature', value: 'feature'},
                      { label: 'set gallery', value: 'gallery'},
                      { label: 'set owner(s)', value: 'own'},
                      { label: 'set for-sale', value: 'sell'},
                      { label: 'set sold', value: 'sold'},
                    ],
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
            name: "feature-step",
            nextStep: "done-step",
            fields: [
              {
                component: componentTypes.PLAIN_TEXT,
                name: "ddf.feature",
                label: "sorry, not yet",
              }
          ],
          },          
          {
            name: "gallery-step",
            nextStep: "done-step",
            fields: [
              {
                component: componentTypes.PLAIN_TEXT,
                name: "ddf.gallery",
                label: "sorry, not yet",
              }
          ],
          },          
          {
            name: "own-step",
            nextStep: "done-step",
            fields: [
              {
                name: "own",
                component: componentTypes.SUB_FORM,
                title: 'Set Owner(s)',
                description: 'edit historical and current owners',
                fields: [
                  {
                    component: componentTypes.FIELD_ARRAY,
                    name: "boat.ownerships.owners",
                    label: "Owners",
                    fields: [
                      { 
                        name: 'name',
                        label: 'Owner',
                        component: componentTypes.TEXT_FIELD,
                        resolveProps: (props, { meta, input }, formOptions) => {
                          const { values } = formOptions.getState();
                          const index = parseInt(input.name.split(/[[\]]/)[1]);
                          const r = values.boat.ownerships.owners[index];
                          if (r.name) {
                            return { initialValue: r.name };
                          }
                          return { initialValue: `${r.member}/${r.id}` };
                        }
                      },
                      { 
                        name: 'start',
                        label: 'From',
                        component: componentTypes.TEXT_FIELD
                      },
                      { 
                        name: 'end',
                        label: 'To',
                        component: componentTypes.TEXT_FIELD
                      },
                      { 
                        name: 'share',
                        label: 'Share',
                        component: componentTypes.TEXT_FIELD,
                      }
                    ],
                  },
                  {
                    component: componentTypes.TEXT_FIELD,
                    name: "boat.name",
                    label: "name",
                  },
                ],
              },
          ],
          },          
          {
            name: "sell-step",
            nextStep: "done-step",
            fields: [
              {
                component: componentTypes.PLAIN_TEXT,
                name: "ddf.sell",
                label: "sorry, not yet",
              }
          ],
          },
          {
            name: "sold-step",
            nextStep: "done-step",
            fields: [
              {
                component: componentTypes.PLAIN_TEXT,
                name: "ddf.sold",
                label: "sorry, not yet",
              }
            ],
          },
          {
            name: "done-step",
            fields: [
              {
                component: componentTypes.PLAIN_TEXT,
                name: "ddf.we_are_done",
                label:
                  "Thanks for helping make the register better.",
              },
              {
                component: componentTypes.TEXT_FIELD,
                name: "email",
                label: "email",
                isRequired: true,
                validate: [
                  { type: validatorTypes.REQUIRED },
                  {
                    type: validatorTypes.PATTERN,
                    pattern: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
                  }
                ]
              },
            ],
          },
        ],
      },
    ],
  };
};

const queryIf = (o) => o.member && (o.name === undefined || o.name.trim() === '');

export default function AdminForm({ onCancel, onSave, boat }) {
  const memberNumbers = boat.ownerships.owners.filter((o) => queryIf(o)).map((o) => o.member);
  const [getMembers, getMembersResults] = useLazyQuery(gql(`query members($members: [Int]!) {
    members(members: $members) {
      firstname
      lastname
      member
      id
    }
  }`));

  if (memberNumbers.length > 0 && !getMembersResults.called) {
    getMembers(memberNumbers);
  }
  if (getMembersResults.called && !getMembersResults.loading && !getMembersResults.error) {
    boat.ownerships.owners = boat.ownerships.owners.map((owner) => {
      if (owner.name) {
        return owner;
      }
      const m = getMembersResults.data.members.find((r) => owner.member === r.member && owner.id === r.id);
      return {
        ...owner,
        name: `${m[0].firstname} ${m[0].lastname}`
      };
    });
  }

  const state = { 
    ddf: { activity: "feature" },
    boat,
  };

  const handleSubmit = (values) => {
    onSave(values);
  };

  return (
      <FormRenderer
        schema={schema()}
        componentMapper={{
          ...componentMapper,
          html: HtmlEditor,
        }}
        FormTemplate={(props) => (
          <FormTemplate {...props} showFormControls={false} />
        )}
        onCancel={onCancel}
        onSubmit={handleSubmit}
        initialValues={state}
      />
  );
}
