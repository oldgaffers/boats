import { componentTypes, dataTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";

export const mapPicker = (m) => {
  return m.map((val) => {
    if (val.id) {
      return { label: val.name, value: val.id }
    }
    return { label: val.name, value: val.name }
  });
}

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
    label: "Air draft",
    type: 'number',
    dataType: dataTypes.FLOAT,
  }
]}
};
