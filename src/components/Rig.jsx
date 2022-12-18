import { componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import { mapPicker } from "./ddf/util";

export const rigForm = (pickers) => {
  return {
  title: "Rig",
  name: "rig",
  component: componentTypes.SUB_FORM,
  fields: [
    {
      component: componentTypes.SELECT,
      name: "mainsail_type",
      label: "Mainsail",
      isRequired: true,
      options: mapPicker(pickers.sail_type),
      validate: [
        {
          type: validatorTypes.REQUIRED
        }
      ]
    },
    {
      component: componentTypes.SELECT,
      name: "rig_type",
      label: "Rig",
      isRequired: true,
      options: mapPicker(pickers.rig_type),
      validate: [
        {
          type: validatorTypes.REQUIRED
        }
      ]
    },
    {
    component: componentTypes.TEXT_FIELD,
    name: "air_draft",
    label: "Air Draft (decimal feet)",
    type: 'number',
    dataType: 'float',
  }
]}
};
