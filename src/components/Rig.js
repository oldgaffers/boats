import React from "react";
import FormRenderer, { componentTypes } from "@data-driven-forms/react-form-renderer";
import { componentMapper, FormTemplate } from "@data-driven-forms/mui-component-mapper";
import HullForm from './HullForm';
import { big_boat_images } from './HullForms'
import { dinghy_images } from './DinghyHullForms'

const mapPicker = (m) => {
  return m.map((val) => {
    if (val.id) {
      return { label: val.name, value: val.id }
    }
    return { label: val.name, value: val.name }
  });
}

export const steps = (pickers) => [
{
    title: "Rig",
    name: "rig",
    component: componentTypes.SUB_FORM,
    "nextStep": "type",
    fields: [
      {
        component: componentTypes.SELECT,
        name: "rig_type",
        label: "Rig",
        "isRequired": true,
        "options": mapPicker(pickers.rig_type)
        },
      {
        component: componentTypes.SELECT,
        name: "mainsail_type",
        label: "Mainsail",
        "isRequired": true,
        "options": mapPicker(pickers.sail_type)
      }
    ]
  },
  {
    title: "Type",
    name: "type",
    component: componentTypes.SUB_FORM,
    "nextStep": ({ values }) => {
      console.log('generic type', values)
      return (values.generic_type === 'Dinghy') ? 'dinghy-hull' : 'hull';
    },
    fields: [
      {
        component: componentTypes.SELECT,
        name: "generic_type",
        label: "Generic Type",
        "isRequired": true,
        "options": mapPicker(pickers.generic_type)
      }
    ]
  },
  {
    title: "Hull",
    name: "hull",
    component: componentTypes.SUB_FORM,
    "nextStep": "dimensions",
    fields: [
      {
        component: 'hull-form',
        name: "hull_form",
        label: "Hull Form",
        "options": big_boat_images,
      }
    ]
  },
  {
    title: "Hull",
    name: "dinghy-hull",
    component: componentTypes.SUB_FORM,
    "nextStep": "dimensions",
    fields: [
      {
        component: 'hull-form',
        name: "hull_form",
        label: "Hull Form",
        "options": dinghy_images,
      }
    ]
  },
  {
    name: "dimensions",
    "nextStep": "design",
    component: componentTypes.SUB_FORM,
    title: "Dimensions",
    fields: [
      {
        component: componentTypes.TEXT_FIELD,
        name: "length_on_deck",
        label: "Length on Deck",
        dataType: 'float',
      },
      {
        component: componentTypes.TEXT_FIELD,
        name: "beam",
        label: "Beam",
        dataType: 'float',
      },
      {
        component: componentTypes.TEXT_FIELD,
        name: "draft",
        label: "Draft",
        dataType: 'float',
      },
      {
        component: componentTypes.TEXT_FIELD,
        name: "air_draft",
        label: "Air draft",
        dataType: 'float',
      }
    ]
  },
  {
    title: "Design",
    name: "design",
    component: componentTypes.SUB_FORM,
    "nextStep": "build",
    fields: [
      {
        component: componentTypes.SELECT,
        name: "design_class",
        label: "Design class",
        "isRequired": false,
        "options": mapPicker(pickers.design_class)                
        },
      {
        component: componentTypes.SELECT,
        name: "designer",
        label: "Designer",
        "isRequired": false,
        "options": mapPicker(pickers.designer)              
      }
    ]
  },
  {
    title: "Build",
    name: "build",
    component: componentTypes.SUB_FORM,
    fields: [
      {
        component: componentTypes.SELECT,
        name: "builder",
        label: "Builder",
        "options": mapPicker(pickers.builder)              
      },
      {
        component: componentTypes.TEXT_FIELD,
        name: "place_built",
        label: "Where built",
      }
    ]
  }
];

export const schema = (pickers) => {
    return {
    fields: [
      {
        component: componentTypes.WIZARD,
        name: "rigetc",
        fields: steps(pickers)
      }
    ]
  }
};

export default function Rig({ classes, onCancel, onSave, boat, pickers }) {

 return (<FormRenderer
    schema={schema(pickers)}
    componentMapper={
      { 
        ...componentMapper,
        'hull-form': HullForm,
      }
    }
    FormTemplate={FormTemplate}
    onCancel={onCancel}
    onSubmit={onSave}
    initialValues={boat}
  />);
}
