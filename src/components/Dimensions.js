import { componentTypes } from "@data-driven-forms/react-form-renderer";

export const dimensionsForm = {
  name: "dimensions",
  component: componentTypes.SUB_FORM,
  title: "Dimensions (decimal feet)",
  fields: [
    {
      component: componentTypes.TEXT_FIELD,
      name: "length_on_deck",
      label: "Length on Deck",
      dataType: 'float',
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: "handicap_data.length_overall",
      label: "Length overall (LOA)",
      dataType: 'float',
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: "handicap_data.length_on_waterline",
      label: "Waterline Length (LWL)",
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
  ]
};
