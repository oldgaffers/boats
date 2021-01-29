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

const rigForm = (pickers) => {
  return {
  title: "Rig",
  name: "rig",
  component: componentTypes.SUB_FORM,
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
  },
]}
};

const hullForm =   {
  title: "Hull",
  name: "hull",
  component: componentTypes.SUB_FORM,
  fields: [
    {
      component: componentTypes.RADIO,
      name: "hull_form",
      label: "Hull Form",
      "options": [
        {label: 'cut-away stem', value: 'cut away stem'}, 
        {label: 'cut-away stern', value: 'cut away stern'}, 
        {label: 'long keel deep forefoot', value: 'long keel deep forefoot'},
        {label: 'long keel sloping forefoot', value: 'long keel sloping forefoot'},
        {label: 'fin keel', value: 'fin keel'},
        {label: 'bilge keel', value: 'bilge keel'},
        {label: 'centre-boarder', value: 'centre-boarder'},
        {label: 'lifting bulb keel', value: 'lifting bulb keel'}, 
        {label: 'lee-boarder', value: 'leeboarder'},
      ],
    }
  ]
};

const dinghyHullForm =   {
  title: "Hull",
  name: "dinghy-hull",
  component: componentTypes.SUB_FORM,
  fields: [
    {
      component: componentTypes.RADIO,
      name: "hull_form",
      label: "Hull Form",
      "options": [
        {label: 'dinghy', value: 'dinghy'}, 
        {label: 'centre-board dinghy', value: 'centre-board dinghy'},
        {label: 'lee-boarder', value: 'leeboarder'},
      ],
    }
  ]
};

const designForm = (pickers) => { 
  return {
    title: "Design",
    name: "design",
    component: componentTypes.SUB_FORM,
    fields: [
      {
        component: componentTypes.SELECT,
        name: "design_class",
        label: "Design class",
        "isRequired": false,
        isReadOnly: false,
        isSearchable: true,
        isClearable: true,
        "options": mapPicker(pickers.design_class)                
      },
      {
        component: componentTypes.TEXT_FIELD,
        name: "new_design_class",
        label: "A design class not listed",
        "isRequired": false,
      },
      {
        component: componentTypes.SELECT,
        name: "designer",
        label: "Designer",
        "isRequired": false,
        isReadOnly: false,
        isSearchable: true,
        isClearable: true,
        "options": mapPicker(pickers.designer)              
      },
      {
        component: componentTypes.TEXT_FIELD,
        name: "new_designer",
        label: "A designer not listed",
        "isRequired": false,
      },
    ]
  }
};

const buildForm = (pickers) => { 
  return {
    title: "Build",
    name: "build",
    component: componentTypes.SUB_FORM,
    fields: [
      {
        component: componentTypes.SELECT,
        name: "builder",
        label: "Builder",
        isReadOnly: false,
        isSearchable: true,
        isClearable: true,
        "options": mapPicker(pickers.builder)              
      },
      {
        component: componentTypes.TEXT_FIELD,
        name: "new_builder",
        label: "A builder not listed",
        "isRequired": false,
      },
      {
        component: componentTypes.TEXT_FIELD,
        name: "place_built",
        label: "Where built",
      }    
    ]
  }
};

export const steps = (pickers) => [
  {
    name: "rig-step",
    nextStep: "type-step",
    fields: [rigForm(pickers)]
  },
  {
    name: "type-step",
    nextStep: ({ values }) => (values.generic_type === 'Dinghy') ? 'dinghy-hull-step' : 'hull-step',
    fields: [
      {
        title: "Type",
        component: componentTypes.SELECT,
        name: "generic_type",
        label: "Generic Type",
        "isRequired": true,
        "options": mapPicker(pickers.generic_type)
      }
    ]
  },
  {
    name: 'hull-step',
    nextStep: "design-step",
    fields: [hullForm]
  },
  {
    name: 'dinghy-hull-step',
    nextStep: "design-step",
    fields: [dinghyHullForm]
  },
  {
    name: "hull1",
    nextStep: "design-step",
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
    name: "dinghy-hull1",
    nextStep: "design-step",
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
    name: "design-step",
    nextStep: "build-step",
    fields: [designForm(pickers)]
  },
  {
    name: "build-step",
    fields: [buildForm(pickers)]
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
