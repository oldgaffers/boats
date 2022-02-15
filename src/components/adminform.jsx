import React, { useState, useEffect, useCallback } from "react";
import _debounce from 'lodash/debounce';
import { useLazyQuery, gql } from '@apollo/client';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import dataTypes from '@data-driven-forms/react-form-renderer/data-types';
import FormTemplate from '@data-driven-forms/mui-component-mapper/form-template';
import componentMapper from "@data-driven-forms/mui-component-mapper/component-mapper";
import FormSpy from '@data-driven-forms/react-form-renderer/form-spy';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import TextField from '@data-driven-forms/mui-component-mapper/text-field';
import Select from '@data-driven-forms/mui-component-mapper/select';
import BoatIcon from "./boaticon";
import BoatAnchoredIcon from "./boatanchoredicon";
import { HtmlEditor } from "./ddf/RTE";
// const BoatIcon = React.lazy(() => import("./boaticon"));
// const BoatAnchoredIcon = React.lazy(() => import("./boatanchoredicon"));
// const { HtmlEditor } = React.lazy(() => import("./ddf/RTE"));

const MEMBER_QUERY = gql(`query members($members: [Int]!) {
  members(members: $members) {
    firstname
    lastname
    member
    id
  }
}`);

const FieldListener = (props) => {
  console.log('PROPS', props);
  const [getMembers, getMembersResults] = useLazyQuery(MEMBER_QUERY);
  const [field, setField] = useState();
  const { getFieldState, getState, change } = useFormApi();
  const modified = getState().modified;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dbGetMembers = useCallback(_debounce(getMembers, 1000), []);
  
  if (field && modified[field]) {
    const member = getFieldState(field).value;
    console.log('V', member);
    if (!getMembersResults.called) {
      dbGetMembers({ variables: { members: [member] }});
    }
  }

  useEffect(() => {
    const f = Object.keys(modified).find((key) => modified[key]);
    if (f) {
      console.log('CHANGE', f);
      setField(f);
    }
  }, [modified]);

  if (getMembersResults.called) {
    if (getMembersResults.loading) {
      console.log('still loading');
    } else {
      if (getMembersResults.error) {
        console.log(getMembersResults.error);
      } else {
        const m = getMembersResults.data.members;
        if (m.length > 0) {
          console.log(m);
          const member = getFieldState(field).value;
          if (m[0].member === member) {
            console.log('got a good answer');
            if(m.length === 1) {
              change(field.replace('member', 'id'), m[0].id);
              change(field.replace('member', 'share'), 64);
              change(field.replace('member', 'current'), true);
              return (<TextField {...props} value={`${m[0].firstname} ${m[0].lastname}`}/>);
            }
            return (<Select {...props} options={m.map((o) => ({
              label: `${o.firstname} ${o.lastname}`,
              value: o,
            }))}/>);
          } else {
            console.log('user field has changed - refetch');
            getMembers({ variables: { members: [member] }});
          }
        }
      }
    }
  }
  return (<TextField {...props}/>);
};

const FieldListenerWrapper = (props) => <FormSpy subcription={{ values: true }}>{() => <FieldListener {...props} />}</FormSpy>;

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
                        name: 'member',
                        label: 'Membership Number',
                        component: componentTypes.TEXT_FIELD,
                        type: 'string',
                        dataType: dataTypes.INTEGER,
                      },
                      { 
                        name: 'id',
                        label: 'GOLD ID',
                        component: componentTypes.TEXT_FIELD,
                        type: 'string',
                        dataType: dataTypes.INTEGER,
                        /*
                        resolveProps: (props, { meta, input }, formOptions) => {
                          const state = formOptions.getState();
                          if (state.dirty) {
                            onChooseDesignClass(input.value);
                          }
                        },*/
                      },
                      { 
                        name: 'name',
                        label: 'Owner',
                        component: 'field-listener',
                      },
                      { 
                        name: 'start',
                        label: 'From',
                        component: componentTypes.TEXT_FIELD,
                        type: 'string',
                        dataType: dataTypes.INTEGER,
                      },
                      { 
                        name: 'end',
                        label: 'To',
                        component: componentTypes.TEXT_FIELD,
                        type: 'string',
                        dataType: dataTypes.INTEGER,
                      },
                      { 
                        name: 'current',
                        label: 'current',
                        component: componentTypes.CHECKBOX,
                      },
                      { 
                        name: 'share',
                        label: 'Share',
                        component: componentTypes.TEXT_FIELD,
                        type: 'string',
                        dataType: dataTypes.INTEGER,
                        default: 64,
                      },
                    ],
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
            ],
          },
        ],
      },
    ],
  };
};

const queryIf = (o) => o.member && (o.name === undefined || o.name.trim() === '');

export default function AdminForm({ onCancel, onSave, boat }) {
  const [getMembers, getMembersResults] = useLazyQuery(MEMBER_QUERY);
  if (boat.ownerships) {
    const { current } = boat.ownerships;
    if ((!boat.ownerships.owners) && current) {
      boat.ownerships.owners = current;
    }
    const memberNumbers = [...new Set(boat.ownerships.owners.filter((o) => queryIf(o)).map((o) => o.member))];
    if (memberNumbers.length > 0 && !getMembersResults.called) {
      getMembers({ variables: { members: memberNumbers }});
    }
    if (getMembersResults.called) {
      if (getMembersResults.loading) {
        console.log('still loading');
      } else {
        if (getMembersResults.error) {
          console.log(getMembersResults.error);
        } else {
          boat.ownerships.owners = boat.ownerships.owners.map((owner) => {
            if (owner.name) {
              return owner;
            }
            const m = getMembersResults.data.members.find((r) => owner.member === r.member && owner.id === r.id);
            return {
              ...owner,
              name: `${m.firstname} ${m.lastname} (${m.member}:${m.id})`
            };
          });    
        }
      }
    }

    boat.ownerships.owners = boat.ownerships.owners.map((owner) => {
      if (owner.member && current) {
        const c = current.find((r) => owner.member === r.member && owner.id === r.id);
        if (c) {
          return { ...owner, current: true }
        }
      }
      return owner;
    });
  }

  const state = { 
    ddf: { activity: "feature" },
    boat,
  };

  const handleSubmit = (values) => {
    if (values.boat.ownerships) {
      values.boat.ownerships.owners.forEach((owner) => {
        if (owner.member) {
          delete owner.name;
        }
      });
    }
    onSave({ boat: values.boat });
  };

  return (
      <FormRenderer
        schema={schema()}
        componentMapper={{
          ...componentMapper,
          html: HtmlEditor,
          'field-listener': FieldListenerWrapper,
        }}
        FormTemplate={(props) => (
          <FormTemplate {...props} showFormControls={false} />
        )}
        onCancel={onCancel}
        onSubmit={handleSubmit}
        initialValues={state}
        subcription={{ modified: true }}
      />
  );
}
