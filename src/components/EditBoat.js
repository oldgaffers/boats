import React from "react";
import Typography from '@material-ui/core/Typography';
import FormRenderer, { componentTypes, useFieldApi } from "@data-driven-forms/react-form-renderer";
import { componentMapper, FormTemplate } from "@data-driven-forms/mui-component-mapper";
import HullForm from './HullForm';
import { steps as rig_steps } from "./Rig";
import Descriptions from './Descriptions';

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

const DescriptionsEditor = (props) => {
    const { input, meta } = useFieldApi(props);

    const handleCancel = () => {
        props.onCancel();
    }

    const handleSave = (short_description, full_description) => {
        input.onChange({...input.value, short_description, full_description})
    }

    return (<>
    <label>
    <Typography variant="h6">{props.label}</Typography></label>
    {meta.error && <label>{meta.error}</label>}
    <Descriptions
        {...props}
        onCancel={handleCancel}
        onSave={handleSave}
        short={input.short_description}
        full={input.full_description}
        />;
    </>);
}

const boatfields = (pickers) => {
    return [
        { 
            title: "Update Boat",
            name: "activity",
            nextStep: ({values}) => values.activity,
            component: componentTypes.SUB_FORM,
            fields: [
                {
                    component: componentTypes.TEXT_FIELD,
                    name: "email",
                    label: "email",        
                },
                {
                    component: componentTypes.RADIO,
                    name: "activity",
                    label: "Where would you like to start?",
                    options: activities
                },
            ]
        },
        { 
            title: "Description",
            name: "descriptions",
            component: componentTypes.SUB_FORM,
            nextStep: "rig",
            "fields": [
                {
                    component: 'descriptions-editor',
                    name: "descriptions-editor",
                    label: "Edit the short and full descriptions",        
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

export default function EditBoat({ classes, onCancel, onSave, boat, pickers }) {
    console.log('rig steps', rig_steps(pickers));
    console.log('schema', schema(pickers));
    return (<FormRenderer
       schema={schema(pickers)}
       componentMapper={
         { 
           ...componentMapper,
           'hull-form': HullForm,
           'descriptions-editor': DescriptionsEditor,
         }
       }
       FormTemplate={FormTemplate}
       onCancel={onCancel}
       onSubmit={onSave}
       initialValues={boat}
     />);
   }
   