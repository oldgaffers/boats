import React, { useState } from "react";
import FormRenderer, {
  componentTypes,
} from "@data-driven-forms/react-form-renderer";
import {
  componentMapper,
  FormTemplate,
} from "@data-driven-forms/mui-component-mapper";

const rig_schema = (pickers) => {
    return {
    "fields": [
      {
        "component": "wizard",
        "name": "rigetc",
        "fields": [
          {
            "title": "Rig",
            "name": "rig",
            "nextStep": "hull",
            "fields": [
              {
                "component": "select",
                "name": "rig_type",
                "label": "Rig",
                "isRequired": true,
                "options": pickers.rig_type.map((val) => {return {label: val.name}})
                },
              {
                "component": "select",
                "name": "mainsail_type",
                "label": "Mainsail",
                "isRequired": true,
                "options": pickers.sail_type.map((val) => {return {label: val.name}})
              }
            ]
          },
          {
            "title": "Hull",
            "name": "hull",
            "nextStep": "dimensions",
            "fields": [
              {
                "component": "text-field",
                "name": "hull_form",
                "label": "Hull Form"
              }
            ]
          },
          {
            "name": "dimensions",
            "nextStep": "design",
            "title": "Dimensions",
            "fields": [
              {
                "component": "text-field",
                "name": "length_on_deck",
                "label": "Length on Deck",
              },
              {
                "component": "text-field",
                "name": "beam",
                "label": "Beam",
              },
              {
                "component": "text-field",
                "name": "draft",
                "label": "Draft",
              },
              {
                "component": "text-field",
                "name": "air_draft",
                "label": "Air draft",
              }
            ]
          },
          {
            "title": "Design",
            "name": "design",
            "fields": [
              {
                "component": "select",
                "name": "design_class",
                "label": "Design class",
                "isRequired": true,
                "options": pickers.design_class.map((val) => {return {label: val.name}})
                },
              {
                "component": "select",
                "name": "designer",
                "label": "Designer",
                "isRequired": true,
                "options": pickers.designer.map((val) => {return {label: val.name}})                
              }
            ]
          }
        ]
      }
    ]
  }
};

export default function Rig({ classes, onCancel, onSave, boat, pickers }) {

  /* 
  mainsail_type | rig_type | hull_form | 
  draft  |  beam  | length_on_deck | air_draft | builder | designer |
   generic_type | design_class |
  */
 return (<FormRenderer
    schema={rig_schema(pickers)}
    componentMapper={componentMapper}
    FormTemplate={FormTemplate}
    onSubmit={onSave}
    initialValues={boat}
  />);
}
