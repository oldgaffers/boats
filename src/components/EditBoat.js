import React, { useRef } from "react";
import RemoveIcon from '@material-ui/icons/Remove';
import FormRenderer, { componentTypes, useFieldApi, useFormApi } from "@data-driven-forms/react-form-renderer";
import { componentMapper } from "@data-driven-forms/mui-component-mapper";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIRichTextEditor from 'mui-rte';
import { stateToHTML } from 'draft-js-export-html';
import { convertFromHTML, ContentState, convertFromRaw, convertToRaw } from 'draft-js'
import HullForm from './HullForm';
import { steps as rig_steps } from "./Rig";
import { steps as handicap_steps } from "./Handicap";
import BoatIcon from "./boaticon";
import { usePicklists } from '../util/picklists';

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

    // should we use the ref from meta????
    // todo find a way to call ref.save() when the continue/submit button is pressed

    const ref = useRef(null);
    const { input, meta } = useFieldApi(props);

    console.log('RTE meta', meta);
    console.log('RTE input', input);

    const handleBlur = () => {
        console.log('RTE blur', ref);
        ref.current.save();
    }

    const handleSave = (data) => {
        console.log('RTE save');
        input.onChange(stateToHTML(convertFromRaw(JSON.parse(data))));
    }

    return <>
    {props.title}
    <MUIRichTextEditor
    controls={props.controls}
    onSave={handleSave}
    defaultValue={htmlToRTE(input.value)}
    onBlur={handleBlur}
    ref={ref}
    />
    </>;
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
            name: "ddf_activity",
            label: "What would you like to do?",
            options: activities,
            RadioProps: { icon: <RemoveIcon color="primary"/>, checkedIcon: <BoatIcon color="primary"/> }
            //RadioProps: { icon: <BoatIcon color="disabled"/>, checkedIcon: <BoatIcon color="primary"/> }
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
                name: 'boat',
                fields: [
                    { 
                        name: "activity-step",
                        nextStep: ({values}) => `${values.ddf_activity}-step`,
                        fields: [activityForm],
                    },
                    {
                        name: "descriptions-step",
                        nextStep: 'rig-step',    
                        fields: [descriptionsForm],
                    },
                    ...rig_steps(pickers),
                    ...handicap_steps(pickers),
                    { 
                        name: "ownership-step",
                        nextStep: "identities-step",
                        fields: [
                            {
                                component: componentTypes.TEXT_FIELD,
                                name: "todo3",
                                label: "TODO",        
                            },
                        ]
                    },
                    { 
                        "name": "identities-step",
                        "nextStep": "references-step",
                        "fields": [
                            {
                                component: componentTypes.TEXT_FIELD,
                                name: "todo4",
                                label: "TODO",        
                            },
                        ]
                    },
                    { 
                        "name": "references-step",
                        "nextStep": "everything-else-step",
                        "fields": [
                            {
                                component: componentTypes.TEXT_FIELD,
                                name: "todo5",
                                label: "TODO",        
                            },
                        ]
                    },
                    { 
                        "name": "everything-else-step",
                        "fields": [
                            {
                                component: componentTypes.TEXT_FIELD,
                                name: "todo6",
                                label: "TODO",        
                            },
                        ]
                    },        
                ]
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

const JC = '~';

function flatten1(o, prefix) {
    return Object.keys(o).map(key => {
        const k2 = prefix?`${prefix}${JC}${key}`:key;
        if(typeof o[key] === 'object') {
            if(o[key] === null) {
                return {[k2]: o[key]}
            } else if(Array.isArray(o[key])) {
                return {[k2]: o[key]}
            } else {
                return flatten1(o[key], k2);
            }
        }
        return {[k2]: o[key]}
    }).flat()
}

function flatten(boat) {
    return flatten1(boat).flat().reduce((a,c)=>{return {...a,...c}});
}

function unflatten(o) {
    const outers = new Set();
    Object.keys(o).forEach(key => {
        if(key.includes(JC)) {
            const f = key.split(JC);
            outers.add(f[0]);
        } else {
            outers.add(key);
        }
    });
    const r = {};
    outers.forEach(outer => {
        if(o[outer]) {
            r[outer] = o[outer];
        } else {
            const c = {};
            const t = {};
            Object.keys(o).forEach(key => {
                if(key.startsWith(outer)) {
                    const f = key.split(JC);
                    f.shift();
                    if(f.length == 1) {
                        c[f[0]] = o[key];
                    } else {
                        t[f.join(JC)] = o[key];
                    }
                }
            });
            r[outer] = {...c, ...unflatten(t)};
        }
    });
    return r;
}

export default function EditBoat({ classes, onCancel, onSave, boat }) {

    const { loading, error, data } = usePicklists();

    if (loading) return (<p>Loading...</p>); // change to spinner
    if (error) return (<p>Error :(can't get picklists)</p>);
  
    const pickers = data;  

    const state = {...flatten(boat), ddf_activity: 'descriptions'}; 
    console.log(state);

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
       onSubmit={(values) => onSave(unflatten(values))}
       initialValues={state}
     />
     </MuiThemeProvider>);
   }
   