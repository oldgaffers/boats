import { Typography } from "@mui/material";
import { mapPicker } from "./util";
import {
  intField,
  designerItems,
  builderItems,
  designClassItems,
  constructionItems,
} from "./util";

export const basicFields = (pickers) => [
  {
    component: 'select',
    name: "mainsail_type",
    label: "Mainsail",
    isRequired: true,
    validate: [
      {
        type: 'required',
      },
    ],
    options: mapPicker(pickers.sail_type),
    isOptionEqualToValue: (option, value) => option.value === value,
  },
  {
    component: 'select',
    name: "rig_type",
    label: "Rig",
    isRequired: true,
    validate: [
      {
        type: 'required',
      },
    ],
    options: mapPicker(pickers.rig_type),
    isOptionEqualToValue: (option, value) => option.value === value,
  },
  {
    component: 'select',
    name: "generic_type",
    label: "Generic Type",
    isReadOnly: false,
    isSearchable: true,
    isClearable: true,
    isOptionEqualToValue: (option, value) => option.value === value,
    options: mapPicker(pickers.generic_type),
  },
];

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
    component: "html",
    title: "Short description",
    name: "short_description",
    controls: ["bold", "italic"], // for ckeditor
    toolbar: 'undo redo | bold italic removeformat | help', // for tinymce
    maxLength: 100,
    height: 2,
    helperText: `The short description appears on the boat's card and should be one or two lines long.

        It shouldn't replicate data also included on the card, like rig type, designer, builder, etc.`,
  },
  {
    component: "html",
    title: "Full description",
    name: "full_description",
    controls: ["heading", "bold", "italic", "numberedList", "bulletedList", "link"],
    toolbar: 'undo redo | blocks | bold italic numlist bullist link removeformat',
    height: 3,
    helperText: `The full description appears on the boat's detail page and can be as long as you like.

        It shouldn't replicate the short description. Do include historical details, significant voyages,
      rebuilds and links to external videos, etc.
    `,
  },
  {
    component: 'plain-text',
    name: 'ddf.explain_descriptions',
    label: <Typography variant="caption" sx={{ paddingTop: "1em" }}>
      If you want to sell this boat, there is a separate place for the sales, text,
      so don't put things like inventory in the descriptions.
      </Typography>
  }
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

export const ownershipUpdateFields = [
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
          // console.log('O', props);
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
        ...intField('start', 'First Possible Start Year'),
        isRequired: true,
        validate: [{ type: 'required' }],
        FormFieldGridProps: { xs: 6 },
      },
      {
        name: 'start_is_approximate',
        label: 'approximate',
        component: 'checkbox',
        FormFieldGridProps: { xs: 6 },
      },
      {
        ...intField('end', 'Last Possible End Year'),
        FormFieldGridProps: { xs: 6 },
      },
      {
        name: 'end_is_approximate',
        label: 'approximate',
        component: 'checkbox',
        FormFieldGridProps: { xs: 6 },
      },
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
      name: "mmsi",
      label: "MMSI",
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

export const hullFields = [
  {
    name: "hullform",
    title: "Hull Form",
    component: 'sub-form',
    fields: [
      {
        component: 'radio',
        label: 'choose from',
        name: "hull_form",
        resolveProps: (props, { meta, input }, formOptions) => {
          const { values } = formOptions.getState();
          if (["Dinghy", "Dayboat"].includes(values.generic_type)) {
            return {
              options: [
                { label: "dinghy", value: "dinghy" },
                { label: "centre-board dinghy", value: "centre-board dinghy" },
                { label: "lee-boarder", value: "leeboarder" },
              ],
            }
          }
          return {
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
          };
        },
      },
    ],
  },
];

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
            initialValue: 'long keel deep forefoot',
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
        component: 'checkbox',
        name: "handicap_data.checked",
        label: "I've checked all handicap data and I believe it to be correct.",
        condition: {
          when: "ddf.owner",
          is: true,
        }
      },
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
    controls: ["heading", "bold", "italic", "numberedList", "bulletedList", "link"],
    toolbar: 'undo redo | blocks | bold italic numlist bullist link removeformat',
    height: 4,
    maxLength: 500,
    isRequired: true,
    validate: [{ type: 'required' }],
  },
  {
    component: "text-field",
    name: 'ddf.current_sales_record.reduced',
    hideField: true,
    value: false
  },
  {
    component: "text-field",
    name: 'ddf.current_sales_record.flexibility',
    label: 'Price flexibility',
    hideField: false ,
  },
  {
    component: "text-field",
    name: 'ddf.current_sales_record.summary',
    hideField: true,
  },
  {
    component: "text-field",
    name: 'ddf.current_sales_record.sold',
    hideField: true,
  },
  {
    component: "text-field",
    name: 'ddf.current_sales_record.offered',
    hideField: true,
  },
  {
    component: "text-field",
    name: 'ddf.current_sales_record.updated_at',
    hideField: true,
  },
  {
    component: "text-field",
    name: 'ddf.current_sales_record.created_at',
    hideField: true,
  },
  {
    component: "text-field",
    name: 'ddf.current_sales_record.seller_gold_id',
    hideField: true,
  },
  {
    component: "text-field",
    name: 'ddf.current_sales_record.seller_member',
    hideField: true,
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
            name: 'ddf.update_sale',
            initialValue: 'update',
            label: 'Update Sales Status',
            options: [
              { label: 'I want to take boat off the market for the present', value: 'unsell' },
              { label: "The boat has been sold", value: 'sold' },
              { label: "I want to check the price and sales text", value: 'update' },
            ],
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
            component: "checkbox",
            name: 'ddf.current_sales_record.reduced',
            label: 'Reduced',
            hideField: false,
          },
          {
            component: "text-field",
            name: 'ddf.current_sales_record.flexibility',
            label: 'Price flexibility',
            hideField: false ,
          },
          {
            component: 'html',
            name: "ddf.current_sales_record.sales_text",
            controls: ["heading", "bold", "italic", "numberedList", "bulletedList", "link"],
            toolbar: 'undo redo | blocks | bold italic numlist bullist link removeformat',
            maxLength: 500,
            title: "Updated Sales Text",
          },
          {
            component: "text-field",
            name: 'ddf.current_sales_record.summary',
            hideField: true,
          },
          {
            component: "text-field",
            name: 'ddf.current_sales_record.sold',
            hideField: true,
          },
          {
            component: "text-field",
            name: 'ddf.current_sales_record.offered',
            hideField: true,
          },
          {
            component: "text-field",
            name: 'ddf.current_sales_record.updated_at',
            hideField: true,
          },
          {
            component: "text-field",
            name: 'ddf.current_sales_record.created_at',
            hideField: true,
          },
          {
            component: "text-field",
            name: 'ddf.current_sales_record.seller_gold_id',
            hideField: true,
          },
          {
            component: "text-field",
            name: 'ddf.current_sales_record.seller_member',
            hideField: true,
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
            toolbar: 'undo redo | bold italic removeformat | help', // for tinymce
            maxLength: 500,
            isRequired: true,
            validate: [{ type: 'required' }],
          },
        ],
      },
    ],
  }
];