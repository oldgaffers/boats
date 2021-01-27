import React from "react";
import RemoveIcon from '@material-ui/icons/Remove';
import FormRenderer, { componentTypes, useFieldApi, useFormApi } from "@data-driven-forms/react-form-renderer";
import { componentMapper } from "@data-driven-forms/mui-component-mapper";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIRichTextEditor from 'mui-rte';
import { stateToHTML } from 'draft-js-export-html';
import { convertFromHTML, ContentState, convertToRaw } from 'draft-js'
import HullForm from './HullForm';
import { steps as rig_steps } from "./Rig";
import BoatIcon from "./boaticon";


const defaultTheme = createMuiTheme()

Object.assign(defaultTheme, {
  overrides: {
      MUIRichTextEditor: {
          root: {
            width: "100%"
          },
          toolbar: {
            borderTop: "1px solid gray",
            borderLeft: "1px solid gray",
            borderRight: "1px solid gray",
            backgroundColor: "whitesmoke"
          },
          editor: {
              border: "1px solid gray",
              marginBottom: 10,
              paddingLeft: '5px',
              paddingRight: '5px'
          }
      }
  }
})

function htmlToRTE(html) {
  const contentHTML = convertFromHTML(html || '');
  const contentState = ContentState.createFromBlockArray(contentHTML.contentBlocks, contentHTML.entityMap)
  return JSON.stringify(convertToRaw(contentState));
}

const HtmlEditor = (props) => {
    const { input, meta } = useFieldApi(props);
    return <MUIRichTextEditor
    controls={props.controls}
    onChange={(rte) => input.onChange(stateToHTML(rte.getCurrentContent()))}
    defaultValue={htmlToRTE(input.value)}
    />;
}

const activities_all = [
    { label: 'Edit the short and full descriptions', value: 'descriptions' },
    { label: 'Edit type, rig and/or basic dimensions', value: 'rig' },
    { label: 'Add/change a handicap', value: 'handicap' },
    { label: 'Edit the ownership and/or for sale information.', value: 'ownership' },
    { label: 'Add or edit sail number, SSR, MSSI or other identifications', value: 'identities' },
    { label: 'Add a document reference', value: 'references' },
    { label: 'Something else', value: 'everything-else' },
];

const activities = [
    { label: 'Edit the short and full descriptions', value: 'descriptions' },
    { label: 'Edit type, rig and/or basic dimensions', value: 'rig' },
];

const boatfields = (pickers) => {
    return [
        { 
            title: "Update Boat",
            name: "activity",
            nextStep: ({values}) => values.activity,
            component: componentTypes.SUB_FORM,
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
                    name: "activity",
                    label: "What would you like to do?",
                    options: activities,
                    RadioProps: { icon: <RemoveIcon color="primary"/>, checkedIcon: <BoatIcon color="primary"/> }
                    //RadioProps: { icon: <BoatIcon color="disabled"/>, checkedIcon: <BoatIcon color="primary"/> }
                },
            ]
        },
        { 
            title: "Description",
            name: "descriptions",
            component: componentTypes.SUB_FORM,
            "fields": [
                {
                    component: componentTypes.PLAIN_TEXT,
                    name: "short_label",
                    label: "Edit the short description",        
                },
                {
                    component: 'html',
                    name: "short_description",
                    controls: ["bold", "italic"],
                },
                {
                    component: componentTypes.PLAIN_TEXT,
                    name: "full_label",
                    label: "Edit the full description",        
                },
                {
                    component: 'html',
                    name: "full_description",
                    controls: ["title", "bold", "italic", "numberList", "bulletList", "link" ],
                },
            ]
        },       
        ...rig_steps(pickers),
        { 
            "title": "Handicap",
            "name": "handicap",
            component: componentTypes.SUB_FORM,
            "nextStep": "ownership",
            "fields": [
                {
                    component: componentTypes.TEXT_FIELD,
                    name: "todo2",
                    label: "TODO",        
                },
            ]
        },
        { 
            "title": "Ownership",
            "name": "ownership",
            component: componentTypes.SUB_FORM,
            "nextStep": "identities",
            "fields": [
                {
                    component: componentTypes.TEXT_FIELD,
                    name: "todo3",
                    label: "TODO",        
                },
            ]
        },
        { 
            "title": "Identities",
            "name": "identities",
            component: componentTypes.SUB_FORM,
            "nextStep": "references",
            "fields": [
                {
                    component: componentTypes.TEXT_FIELD,
                    name: "todo4",
                    label: "TODO",        
                },
            ]
        },
        { 
            "title": "References",
            "name": "references",
            "nextStep": "everything-else",
            component: componentTypes.SUB_FORM,
            "fields": [
                {
                    component: componentTypes.TEXT_FIELD,
                    name: "todo5",
                    label: "TODO",        
                },
            ]
        },
        { 
            "title": "Other",
            "name": "everything-else",
            component: componentTypes.SUB_FORM,
            "fields": [
                {
                    component: componentTypes.TEXT_FIELD,
                    name: "todo6",
                    label: "TODO",        
                },
            ]
        },        
    ];
};

export const schema = (pickers) => {
    return {
        fields: [
            {
                component: componentTypes.WIZARD,
                name: 'boat',
                fields: boatfields(pickers)
            }
        ]
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

export default function EditBoat({ classes, onCancel, onSave, boat, pickers }) {
    console.log('rig steps', rig_steps(pickers));
    console.log('schema', schema(pickers));
    const state = {...boat, activity: 'descriptions' }; 
    console.log('rig', `'${state.rig_type}'`);
    console.log(boat);
    return (<MuiThemeProvider theme={defaultTheme}>
    <FormRenderer
       schema={schema(pickers)}
       componentMapper={
         { 
           ...componentMapper,
           'hull-form': HullForm,
           'html': HtmlEditor,
         }
       }
       FormTemplate={FormTemplate}
       onCancel={onCancel}
       onSubmit={onSave}
       initialValues={state}
     />
     </MuiThemeProvider>);
   }
   