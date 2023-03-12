import { Typography } from "@mui/material";
import { mapPicker } from "./util";
import {
  designerItems,
  builderItems,
  designClassItems,
  constructionItems,
} from "./util";

export const referencesItems = [
  {
    component: 'field-array',
    name: "reference",
    label: "References in Gaffers Log, etc.",
    fields: [{ component: "text-field" }],
    sx: { paddingTop: 2 },
  },
  {
    component: 'plain-text',
    name: "website.label",
    label: "Website Link",
    variant: "h6",
  },
  {
    component: 'text-field',
    name: "website",
    label: "a valid website url",
    sx: { paddingBottom: 2 },
    validate: [
      {
        type: 'pattern',
        pattern: /^https?:\/\/[^\s/$.?#].[^\s]*$/i
      }
    ]
  },
]

export const descriptionsItems = [
  {
    component: 'plain-text',
    name: 'ddf.descriptions',
    label: <Typography>The short and full descriptions should be about what makes this boat distinct.
      If you want to sell this boat, there is a separate place for the sales, text, so don't put things
      like inventory in the descriptions.
    </Typography>,
  },
  {
    component: 'plain-text',
    name: 'ddf.short_description_helper',
    label: <Typography>The short description appears on
      the boat's card and should be one or two lines long.
      It shouldn't replicate data also included on the card, like rig type, designer, builder, etc.
    </Typography>,
  },
  {
    component: "html",
    title: "Short description",
    name: "short_description",
    controls: ["bold", "italic"],
    maxLength: 100,
  },
  {
    component: 'plain-text',
    name: 'ddf.full_description_helper',
    label: <Typography>The full description appears on
      the boat's detail page and can be as long as you like.
      It shouldn't replicate the short description. Include historical details, significant voyages,
      rebuilds and links to external videos, etc.
    </Typography>,
  },
  {
    component: "html",
    title: "Full description",
    name: "full_description",
    controls: ["heading", "bold", "italic", "numberedList", "bulletedList", "link"],
  },
];

export const yearItems = [
  {
    component: 'text-field',
    name: "year",
    label: "Year Built",
    type: "number",
    dataType: 'integer',
  },
  {
    component: 'checkbox',
    name: "year_is_approximate",
    label: "Approximate",
    dataType: "boolean",
  },
];

export const homeItems = [
  {
    sx: { marginTop: 2, marginBottom: 2 },
    component: 'text-field',
    name: "home_country",
    label: "Home Country",
  },
  {
    component: 'text-field',
    name: "home_port",
    label: "Home Port",
    sx: { marginBottom: 2 },
  },
];

export const registrationForm = {
  title: "Registrations",
  name: "registrations",
  component: 'sub-form',
  fields: [
    {
      component: 'text-field',
      name: "sail_number",
      label: "Sail No.",
    },
    {
      component: 'text-field',
      name: "ssr",
      label: "Small Ships Registry no. (SSR)",
    },
    {
      component: 'text-field',
      name: "nhsr",
      label: "National Register of Historic Vessels no. (NRHV)",
    },
    {
      component: 'text-field',
      name: "fishing_number",
      label: "Fishing No.",
    },
    {
      component: 'text-field',
      name: "callsign",
      label: "Call Sign",
    },
    {
      component: 'text-field',
      name: "nsbr",
      label: "National Small Boat Register",
    },
    {
      component: 'text-field',
      name: "uk_part1",
      label: "Official Registration",
    },
  ],
};

export const constructionForm = (pickers) => {
  return {
    title: "Design & Build",
    name: "construction",
    component: 'sub-form',
    fields: [
      {
        component: 'select',
        name: "generic_type",
        label: "Generic Type",
        isReadOnly: false,
        isSearchable: true,
        isClearable: true,
        options: mapPicker(pickers.generic_type),
      },
      ...designerItems(pickers),
      ...designClassItems(pickers),
      ...yearItems,
      {
        component: 'text-field',
        name: "place_built",
        label: "Place built",
      },
      ...builderItems(pickers),
      ...constructionItems(pickers),
    ],
  };
};

export const yachtHullStep = (nextStep) => {
  return {
    name: "yacht-hull-step",
    component: 'sub-form',
    nextStep,
    fields: [
      {
        name: "hullform",
        title: "Hull Form",
        component: 'sub-form',
        fields: [
          {
            component: 'radio',
            label: 'choose from',
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
    component: 'sub-form',
    nextStep,
    fields: [
      {
        title: "Hull Form",
        name: "hullform",
        component: 'sub-form',
        fields: [
          {
            component: 'radio',
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
