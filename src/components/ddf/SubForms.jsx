import { Typography } from "@mui/material";
import { mapPicker } from "./util";
import {
  designerItems,
  builderItems,
  designClassItems,
  constructionItems,
} from "./util";

export function intField(name, label) {
  return {
    name, label,
    component: "text-field", type: "number", dataType: 'integer',
  };
}

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
    name: 'ddf.short_description_helper',
    label: `The short description appears on
      the boat's card and should be one or two lines long.
      It shouldn't replicate data also included on the card, like rig type, designer, builder, etc.`,
  },
  {
    component: "html",
    title: "Short description",
    name: "short_description",
    controls: ["bold", "italic"],
    maxLength: 100,
    helperText: `It shouldn't replicate the short description. Do include historical details, significant voyages,
      rebuilds and links to external videos, etc.`,
  },
  {
    component: 'plain-text',
    name: 'ddf.full_description_helper',
    label: "The full description appears on the boat's detail page and can be as long as you like.",
  },
  {
    component: "html",
    title: "Full description",
    name: "full_description",
    controls: ["heading", "bold", "italic", "numberedList", "bulletedList", "link"],
    helperText: `If you want to sell this boat, there is a separate place for the sales, text, so don't put things
    like inventory in the descriptions.`,
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

export const ownerShipsFields = [
  {
    component: 'plain-text',
    name: 'ddf.ownerships_label',
    label: 'You can add, remove and edit ownership records on this page.'
      + ' If you are listed as a current owner and this is no-longer true add an end year and uncheck the box.'
      + ' Your changes will be send to the editors who will update the boat\'s record'
  },
  {
    component: 'field-array',
    name: "ownerships",
    label: "Known Owners",
    defaultItem: {
      name: ' ',
    },
    fields: [
      {
        name: 'name',
        label: 'Name',
        component: 'text-field',
        resolveProps: (props, { input }) => {
          // if no GDPR undefined -> not required
          // if empty string -> new row - required
          if (typeof input.value === 'string') {
            return {
              isRequired: true,
              validate: [{ type: 'required' }],
            };
          }
          return {
            isRequired: false,
            helperText: 'name on record but withheld',
          }
        },
      },
      {
        ...intField('start', 'Start Year'),
        isRequired: true,
        validate: [{ type: 'required' }],
      },
      intField('end', 'End Year'),
      {
        ...intField('share', 'Share (64ths)'),
        initialValue: 64,
        isRequired: true,
        validate: [{ type: 'required' }],
      },
      { name: 'current', label: 'Current', component: 'checkbox' },
    ],
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

export const doneFields = [
  {
    name: 'done.form',
    component: 'sub-form',
    fields: [
      {
        component: 'plain-text',
        name: "ddf.we_are_done",
        label:
          "Thanks for helping make the register better. The editor's will review your suggestions. An email address will let us discuss with you any queries we might have.",
      },
      {
        component: 'text-field',
        name: "email",
        label: "email",
        isRequired: true,
        validate: [
          { type: 'required' },
          {
            type: 'pattern',
            pattern: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
          }
        ],
        resolveProps: (props, { meta, input }, formOptions) => {
          const { values } = formOptions.getState();
          return {
            initialValue: values.user?.email,
          };
        },
      },
    ],
  },
];

export const sellingDataFields = [
  {
    component: 'text-field',
    name: "ddf.current_sales_record.asking_price",
    label: "Price (pounds)",
    type: "number",
    dataType: 'float',
    isRequired: true,
    validate: [{ type: 'required' }],
  },
  {
    component: "html",
    title: "Sales Text",
    name: "ddf.current_sales_record.sales_text",
    controls: ["bold", "italic"],
    maxLength: 500,
    isRequired: true,
    validate: [{ type: 'required' }],
  },
];

export const salesSteps = (firstStep, nextStep) => [
  {
    name: firstStep,
    nextStep: {
      when: "ddf.update_sale",
      stepMapper: {
        'update': "update-sales-data-step",
        'sold': "sold-step",
        'unsell': 'unsell-confirm-step',
      },
    },
    fields: [
      {
        component: 'sub-form',
        name: 'update-sales.form',
        title: 'Change Sales Status',
        fields: [
          {
            component: 'radio',
            label: 'Update Sales Status',
            options: [
              { label: 'I want to take boat off the market for the present', value: 'unsell' },
              { label: "The boat has been sold", value: 'sold' },
              { label: "I want to check the price and sales text", value: 'update' },
            ],
            name: 'ddf.update_sale',
            isRequired: true,
            validate: [{ type: 'required' }],
          },
        ],
      },
    ],
  },
  {
    name: 'unsell-confirm-step',
    nextStep: nextStep,
    fields: [
      {
        component: 'plain-text',
        name: 'ddf.confirm-unsell',
        label: 'The boat will no-longer appear in the list of boats for sale, and the normal full description will be provided instead of the sales text'
      }
    ],
  },
  {
    name: "update-sales-data-step",
    nextStep: nextStep,
    fields: [
      {
        title: 'Update Sales Data',
        component: 'sub-form',
        name: 's2.form',
        fields: [
          {
            component: 'text-field',
            name: "ddf.current_sales_record.asking_price",
            label: "New Price (pounds)",
            type: "number",
            dataType: 'float',
          },
          {
            component: 'html',
            name: "ddf.current_sales_record.sales_text",
            controls: ["bold", "italic"],
            maxLength: 500,
            title: "Updated Sales Text",
          },
        ],
      },
    ],
  },
  {
    name: "sold-step",
    nextStep: nextStep,
    fields: [
      {
        title: 'Congratulations on Selling your boat',
        component: 'sub-form',
        name: 's3.form',
        fields: [
          {
            component: "date-picker",
            label: 'Date Sold',
            name: 'ddf.current_sales_record.date_sold',
            isRequired: true,
            initialValue: new Date(),
            DatePickerProps: {},
            validate: [{ type: 'required' }],
          },
          {
            component: 'text-field',
            name: "ddf.current_sales_record.sale_price",
            label: "Final Price (pounds)",
            type: "number",
            dataType: 'float',
            isRequired: true,
            validate: [{ type: 'required' }],
          },
          {
            component: "html",
            helperText: <Typography component='span'>Please add some details,
              <br />including the new owner's name,
              <br />if they are happy to share, and whether
              <br />the Boat Register or
              Gaffer's Log helped with the sale.</Typography>,
            name: "ddf.current_sales_record.summary",
            controls: ["bold", "italic"],
            maxLength: 500,
            isRequired: true,
            validate: [{ type: 'required' }],
          },
        ],
      },
    ],
  }
];