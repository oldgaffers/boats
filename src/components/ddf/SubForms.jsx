import {
  componentTypes,
  dataTypes,
} from "@data-driven-forms/react-form-renderer";
import { mapPicker } from "./util";
import {
  designerItems,
  builderItems,
  designClassItems,
  constructionItems,
} from "./util";

export const cardForm = (pickers) => {
  return {
    title: "Card",
    name: "card",
    component: componentTypes.SUB_FORM,
    fields: [
      {
        component: "html",
        title: "Short description",
        name: "short_description",
        controls: ["bold", "italic"],
        maxLength: 500,
      },
      {
        component: componentTypes.TEXT_FIELD,
        name: "year",
        label: "Year Built",
        type: "number",
        dataType: dataTypes.INTEGER,
      },
      {
        component: componentTypes.CHECKBOX,
        name: "year_is_approximate",
        label: "Approximate",
        dataType: "boolean",
      },
      {
        component: componentTypes.TEXT_FIELD,
        name: "home_port",
        label: "Home Port",
      },
      ...designerItems(pickers),
      ...builderItems(pickers),
      {
        component: componentTypes.TEXT_FIELD,
        name: "place_built",
        label: "Place built",
      },
    ],
  };
};

export const summaryForm = (pickers) => {
  return {
    title: "Summary",
    name: "summary",
    component: componentTypes.SUB_FORM,
    fields: [
      {
        component: componentTypes.SELECT,
        name: "mainsail_type",
        label: "Mainsail",
        isRequired: true,
        options: mapPicker(pickers.sail_type),
      },
      {
        component: componentTypes.SELECT,
        name: "rig_type",
        label: "Rig",
        isRequired: true,
        options: mapPicker(pickers.rig_type),
      },
      {
        component: componentTypes.TEXT_FIELD,
        name: "home_port",
        label: "Home Port",
      },
      {
        component: componentTypes.TEXT_FIELD,
        name: "website",
        label: "website url",
      },
      {
        component: "html",
        title: "Short description",
        name: "short_description",
        controls: ["bold", "italic"],
        maxLength: 500,
      },
    ],
  };
};

export const descriptionsItems = [
  {
    component: "html",
    title: "Short description",
    name: "short_description",
    controls: ["bold", "italic"],
    maxLength: 500,
  },
  {
    component: "html",
    title: "Full description",
    name: "full_description",
    controls: ["title", "bold", "italic", "numberList", "bulletList", "link"],
  },
];

export const yearItems = [
  {
    component: componentTypes.TEXT_FIELD,
    name: "year",
    label: "Year Built",
    type: "number",
    dataType: dataTypes.INTEGER,
  },
  {
    component: componentTypes.CHECKBOX,
    name: "year_is_approximate",
    label: "Approximate",
    dataType: "boolean",
  },
];

export const homeItems = [
  {
    component: componentTypes.TEXT_FIELD,
    name: "home_country",
    label: "Home Country",
  },
  {
    component: componentTypes.TEXT_FIELD,
    name: "home_port",
    label: "Home Port",
  },
];

export const descriptionsForm = {
  title: "Edit Descriptions",
  name: "descriptions",
  component: componentTypes.SUB_FORM,
  fields: descriptionsItems,
};

export const LocationForm = {
  title: "History",
  name: "history",
  component: componentTypes.SUB_FORM,
  fields: [
    {
      component: componentTypes.FIELD_ARRAY,
      name: "previous_names",
      label: "Previous name/s",
      fields: [{ component: "text-field" }],
    },
    ...yearItems,
    {
      component: componentTypes.TEXT_FIELD,
      name: "place_built",
      label: "Place built",
    },
    ...homeItems,
  ],
};

export const RegistrationForm = {
  title: "Registrations",
  name: "registrations",
  component: componentTypes.SUB_FORM,
  fields: [
    {
      component: componentTypes.TEXT_FIELD,
      name: "sail_number",
      label: "Sail No.",
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: "ssr",
      label: "Small Ships Registry no. (SSR)",
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: "nhsr",
      label: "National Register of Historic Vessels no. (NRHV)",
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: "fishing_number",
      label: "Fishing No.",
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: "callsign",
      label: "Call Sign",
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: "nsbr",
      label: "National Small Boat Register",
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: "uk_part1",
      label: "Official Registration",
    },
  ],
};

export const constructionForm = (pickers) => {
  return {
    title: "Design & Construction",
    name: "construction",
    component: componentTypes.SUB_FORM,
    fields: [
      {
        component: componentTypes.SELECT,
        name: "generic_type",
        label: "Generic Type",
        isReadOnly: false,
        isSearchable: true,
        isClearable: true,
        options: mapPicker(pickers.generic_type),
      },
      ...designerItems(pickers),
      ...designClassItems(pickers),
      ...builderItems(pickers),
      ...constructionItems(pickers),
    ],
  };
};

export const yachtHullStep = (nextStep) => {
  return {
    name: "yacht-hull-step",
    nextStep,
    fields: [
      {
        name: "hullform",
        title: "Hull Form",
        component: componentTypes.SUB_FORM,
        fields: [
          {
            component: componentTypes.RADIO,
            name: "hull_form",
            options: [
              { label: "cut-away stern", value: "cut away stern" },
              {
                label: "long keel deep forefoot",
                value: "long keel deep forefoot",
              },
              {
                label: "long keel sloping forefoot",
                value: "long keel sloping forefoot",
              },
              { label: "fin keel", value: "fin keel" },
              { label: "bilge keel", value: "bilge keel" },
              { label: "centre-boarder", value: "centre-boarder" },
              { label: "lifting bulb keel", value: "lifting bulb keel" },
              { label: "lee-boarder", value: "leeboarder" },
            ],
          },
        ],
      },
    ],
  };
};

export const dinghyHullStep = (nextStep) => {
  return {
    name: "dinghy-hull-step",
    nextStep,
    fields: [
      {
        title: "Hull Form",
        name: "hullform",
        component: componentTypes.SUB_FORM,
        fields: [
          {
            component: componentTypes.RADIO,
            name: "hull_form",
            options: [
              { label: "dinghy", value: "dinghy" },
              { label: "centre-board dinghy", value: "centre-board dinghy" },
              { label: "lee-boarder", value: "leeboarder" },
            ],
          },
        ],
      },
    ],
  };
};
