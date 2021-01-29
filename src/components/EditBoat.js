import React from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import FormRenderer, { componentTypes, useFormApi } from "@data-driven-forms/react-form-renderer";
import { componentMapper } from "@data-driven-forms/mui-component-mapper";
import { MuiThemeProvider } from '@material-ui/core/styles'
import HullForm from './HullForm';
import { steps as rig_steps } from "./Rig";
import { steps as handicap_steps } from "./Handicap";
import { dimensionsForm } from './Dimensions';
import BoatIcon from "./boaticon";
import BoatAnchoredIcon from "./boatanchoredicon";
import { usePicklists } from '../util/picklists';
import { theme, HtmlEditor } from './ddf/RTE';

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

function doneTest (more) {
    console.log('doneTest', more);
    if (more === 'yes') {
        return 'activity-step';
    }
    return 'yes-we-are-done-step'
}

export const schema = (pickers) => {
    return {
      fields: [
        {
          component: componentTypes.WIZARD,
          name: "boat",
          fields: [
            {
              name: "activity-step",
              nextStep: ({ values }) => `${values.ddf.activity}-step`,
              fields: [activityForm],
            },
            {
                name: "dimensions-step",
              // nextStep: "are-we-done-step",
              fields: [dimensionsForm]
            },
            {
              name: "descriptions-step",
              // nextStep: "are-we-done-step",
              fields: [descriptionsForm],
            },
            ...rig_steps(pickers),
            ...handicap_steps(pickers),
            {
              name: "ownership-step",
              // nextStep: "are-we-done-step",
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
              // nextStep: "are-we-done-step",
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
              // nextStep: "are-we-done-step",
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
              // nextStep: "are-we-done-step",
              fields: [
                {
                  component: componentTypes.TEXT_FIELD,
                  name: "todo6",
                  label: "TODO",
                },
              ],
            },
            {
                name: "are-we-done-step",
                nextStep: ({values}) => doneTest(values.ddf.more),
                fields: [
                {
                  component: "radio",
                  name: "ddf.more",
                  initialValue: 'no',
                  label: "Change other things?",
                  options: [
                    { value: 'no', label: "No" },
                    { value: 'yes', label: "Yes" },
                  ],
                },
              ],
            },
            {
                name: "yes-we-are-done-step",
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

const FormTemplate = ({schema, formFields}) => {
    const { handleSubmit } = useFormApi();
    return (
      <form onSubmit={handleSubmit}>
        { schema.title }
        { formFields }
      </form>
    )
}

const M2F = 3.28084;

function m2f(val) {
    if(val) {
        return Math.round((M2F*val + Number.EPSILON) * 100) / 100;
    }
}

function m2f2(val) {
    if(val) {
        return Math.round((M2F*M2F*val + Number.EPSILON) * 100) / 100;
    }
}

function m2fall(o) {
    if(o) {
        Object.keys(o).map(k => M2F*o[k]);
    }
}

function hcm2f(hc) {
    return {
        ...hc,
        sailarea: m2f2(hc.sailarea),
        fore_triangle_height: m2f(hc.fore_triangle_height),
        fore_triangle_base: m2f(hc.fore_triangle_base),
        length_overall: m2f(hc.length_overall),
        length_on_waterline: m2f(hc.length_on_waterline),
        length_over_spars: m2f(hc.length_over_spars),
        draft_keel_up: m2f(hc.draft_keel_up),
        draft_keel_down: m2f(hc.draft_keel_down),
        main: m2fall(hc.main),
        mizen: m2fall(hc.mizen),
        topsail: m2fall(hc.topsail),
        mizen_topsail: m2fall(hc.mizen_topsail),
        biggest_staysail: m2fall(hc.biggest_staysail),
        biggest_jib: m2fall(hc.biggest_jib),
        biggest_downwindsail: m2fall(hc.biggest_downwindsail),
    }
}

function inFeet(boat) {
    return { ...boat,
        length_on_deck: m2f(boat.length_on_deck),
        beam: m2f(boat.beam),
        draft: m2f(boat.draft),
        air_draft: m2f(boat.air_draft),
        handicap_data: hcm2f(boat.handicap_data),
    };
}

function f2m(val) {
    if(val) {
        return val/M2F;
    }
}

function f2m2(val) {
    if(val) {
        return val/M2F/M2F;
    }
}

function f2mall(o) {
    if(o) {
        Object.keys(o).map(k => o[k]/M2F);
    }
}

function hcf2m(hc) {
  if(hc) {
    return {
        ...hc,
        sailarea: f2m2(hc.sailarea),
        fore_triangle_height: f2m(hc.fore_triangle_height),
        fore_triangle_base: f2m(hc.fore_triangle_base),
        length_overall: f2m(hc.length_overall),
        length_on_waterline: f2m(hc.length_on_waterline),
        length_over_spars: f2m(hc.length_over_spars),
        draft_keel_up: f2m(hc.draft_keel_up),
        draft_keel_down: f2m(hc.draft_keel_down),
        main: f2mall(hc.main),
        mizen: f2mall(hc.mizen),
        topsail: f2mall(hc.topsail),
        mizen_topsail: f2mall(hc.mizen_topsail),
        biggest_staysail: f2mall(hc.biggest_staysail),
        biggest_jib: f2mall(hc.biggest_jib),
        biggest_downwindsail: f2mall(hc.biggest_downwindsail),
    }
  }
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
        const { ddf, ...result } = values;
        console.log('handleSubmit', result);
        onSave({...boat, ...inMetres(result)}); 
    }

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
       FormTemplate={FormTemplate}
       onCancel={onCancel}
       onSubmit={handleSubmit}
       initialValues={state}
     />
     </MuiThemeProvider>);
   }
   