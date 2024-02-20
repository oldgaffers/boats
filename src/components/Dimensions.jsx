import { componentTypes } from "@data-driven-forms/react-form-renderer";

export const dimensionsForm = {
  name: "dimensions",
  component: componentTypes.SUB_FORM,
  title: "Dimensions (decimal feet)",
  fields: [
    {
      component: componentTypes.TEXT_FIELD,
      name: "length_on_deck",
      label: "Length on Deck (LOD)",
      type: 'number',
      dataType: 'float',
      },
    {
      component: componentTypes.TEXT_FIELD,
      name: "handicap_data.length_over_all",
      label: "Length overall (LOA) (excluding spars and rudder)",
      type: 'number',
      dataType: 'float',
      },
    {
      component: componentTypes.TEXT_FIELD,
      name: "handicap_data.length_on_waterline",
      label: "Waterline Length (LWL) excluding rudder",
      type: 'number',
      dataType: 'float',
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: "handicap_data.beam",
      helperText: 'the outside measurement of widest part of the hull excluding rubbing strakes and other appendages',
      label: "Beam",
      type: 'number',
      dataType: 'float',
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: "draft",
      label: "Draft",
      type: 'number',
      dataType: 'float',
    },
  ]
};
