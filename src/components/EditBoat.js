import React from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import FormRenderer, { componentTypes } from "@data-driven-forms/react-form-renderer";
import { componentMapper, FormTemplate } from "@data-driven-forms/mui-component-mapper";
import { MuiThemeProvider } from '@material-ui/core/styles'
import HullForm from './HullForm';
import { steps as rig_steps } from "./Rig";
import { steps as handicap_steps, hcm2f, hcf2m } from "./Handicap";
import { dimensionsForm } from './Dimensions';
import BoatIcon from "./boaticon";
import BoatAnchoredIcon from "./boatanchoredicon";
import { usePicklists } from '../util/picklists';
import { theme, HtmlEditor } from './ddf/RTE';
import { m2df, f2m } from '../util/format';

const activities_all = [
    { label: 'Edit the short and full descriptions', value: 'descriptions' },
    { label: 'Edit type, rig, designer, builder, etc.', value: 'rig' },
    { label: 'Edit basic dimensions', value: 'dimensions' },
    { label: 'Add/change a handicap', value: 'handicap' },
    { label: 'Edit the ownership and/or for sale information.', value: 'ownership' },
    { label: 'Add or edit sail number, SSR, MSSI or other identifications', value: 'identities' },
    { label: 'Add a document reference', value: 'references' },
    { label: 'Something else', value: 'everything-else' },
];

const activities = [
    { label: 'Edit the short and full descriptions', value: 'descriptions' },
    { label: 'Edit type, rig, designer, builder, etc.', value: 'rig' },
    { label: 'Edit basic dimensions', value: 'dimensions' },
    { label: 'Add/change a handicap', value: 'handicap' },
];

const activityForm = {
    name: 'activity',
    component: componentTypes.SUB_FORM,
    title: "Update Boat",
    description: "This form is still in development. If anything doesn't work please contact the editors.",
    fields: [                
        {
            component: componentTypes.PLAIN_TEXT,
            name: "intro",
            label: "An email address will let us discuss your suggestions with you",        
        },
        {
            component: componentTypes.TEXT_FIELD,
            name: "email",
            label: "email",        
        },
        {
            component: componentTypes.RADIO,
            name: "ddf.activity",
            label: "What would you like to do?",
            options: activities,
            RadioProps: { icon: <BoatAnchoredIcon color="primary"/>, checkedIcon: <BoatIcon color="primary"/> }
        },
    ]
};

const descriptionsForm = { 
    title: "Edit Descriptions",
    name: "descriptions",
    component: componentTypes.SUB_FORM,
    "fields": [
        {
            component: 'html',
            title: "Short description",        
            name: "short_description",
            controls: ["bold", "italic"],
            maxLength: 500,
        },
        {
            component: 'html',
            title: "Full description",        
            name: "full_description",
            controls: ["title", "bold", "italic", "numberList", "bulletList", "link" ],
        },
    ]
};

export const schema = (pickers) => {
    return {
      fields: [
        {
          component: componentTypes.WIZARD,
          name: "boat",
          beforeSubmit: () => {console.log('before submit');},
          fields: [
            {
              name: "activity-step",
              nextStep: ({ values }) => `${values.ddf.activity}-step`,
              fields: [activityForm],
            },
            {
              name: "dimensions-step",
              fields: [dimensionsForm]
            },
            {
              name: "descriptions-step",
              nextStep: "done-step",
              fields: [descriptionsForm],
            },
            ...rig_steps(pickers),
            ...handicap_steps,
            {
              name: "ownership-step",
              fields: [
                {
                  component: componentTypes.TEXT_FIELD,
                  name: "todo3",
                  label: "TODO",
                },
              ],
            },
            {
              name: "identities-step",
              fields: [
                {
                  component: componentTypes.TEXT_FIELD,
                  name: "todo4",
                  label: "TODO",
                },
              ],
            },
            {
              name: "references-step",
              fields: [
                {
                  component: componentTypes.TEXT_FIELD,
                  name: "todo5",
                  label: "TODO",
                },
              ],
            },
            {
              name: "everything-else-step",
              fields: [
                {
                  component: componentTypes.TEXT_FIELD,
                  name: "todo6",
                  label: "TODO",
                },
              ],
            },            
            {
                name: "done-step",
                fields: [
                  {
                    component: componentTypes.PLAIN_TEXT,
                    name: "ddf.we_are_done",
                    label: "Thanks for helping make the register better",
                  },
                ],
              },
            ],
        },
      ],
    };
};

function inFeet(boat) {
    return { ...boat,
        length_on_deck: m2df(boat.length_on_deck),
        beam: m2df(boat.beam),
        draft: m2df(boat.draft),
        air_draft: m2df(boat.air_draft),
        handicap_data: hcm2f(boat.handicap_data),
    };
}

function inMetres(boat) {
    return { ...boat,
        length_on_deck: f2m(boat.length_on_deck),
        beam: f2m(boat.beam),
        draft: f2m(boat.draft),
        air_draft: f2m(boat.air_draft),
        handicap_data: hcf2m(boat.handicap_data),
    };
}

export default function EditBoat({ classes, onCancel, onSave, boat }) {

  const { loading, error, data } = usePicklists();

    if (loading) return (<CircularProgress/>);
    if (error) return (<p>Error :(can't get picklists)</p>);
  
    const pickers = data; 

    const state = {...inFeet(boat), ddf: { activity: 'descriptions' } };

    const handleSubmit = (values) => {
      console.log('submit');
      const { ddf, ...result } = values;
      onSave({
        ...boat, 
        ...inMetres(result),
      });
  };

    return (<MuiThemeProvider theme={theme}>
    <FormRenderer
       schema={schema(pickers)}
       componentMapper={
         { 
           ...componentMapper,
           'hull-form': HullForm,
           html: HtmlEditor,
         }
       }
       FormTemplate={(props) => <FormTemplate {...props} showFormControls={false} />}
       onCancel={onCancel}
       onSubmit={handleSubmit}
       initialValues={state}
     />
     </MuiThemeProvider>);
   }
   