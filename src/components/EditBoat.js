import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormRenderer, {
  componentTypes,
} from "@data-driven-forms/react-form-renderer";
import {
  componentMapper,
  FormTemplate,
} from "@data-driven-forms/mui-component-mapper";
import { MuiThemeProvider } from "@material-ui/core/styles";
import HullForm from "./HullForm";
import { rigForm, mapPicker } from "./Rig";
import { steps as handicap_steps,  boatm2f, boatf2m } from "./Handicap";
import { dimensionsForm } from "./Dimensions";
import BoatIcon from "./boaticon";
import BoatAnchoredIcon from "./boatanchoredicon";
import { usePicklists } from "../util/picklists";
import { theme, HtmlEditor } from "./ddf/RTE";
import { m2df, f2m } from "../util/format";

const activities = [
  { label: "Edit the fields used on the boat's card", value: "card" },
  { label: "Edit the summary", value: "summary" },
  { label: "Edit the short and full descriptions", value: "descriptions" },
  { label: "Edit Location & Registration", value: "locations" },
  { label: "Edit Design & Construction", value: "construction" },
  { label: "Edit Hull & Dimensions", value: "dimensions" },
  { label: "Edit Rig & Sails (or get a handicap)", value: "rig" },
];

const activityForm = {
  name: "activity",
  component: componentTypes.SUB_FORM,
  title: "Update Boat",
  description:
    "This form is still in development. If anything doesn't work please contact the editors.",
  fields: [
    {
      component: componentTypes.RADIO,
      name: "ddf.activity",
      label: "What would you like to do?",
      options: activities,
      RadioProps: {
        icon: <BoatAnchoredIcon color="primary" />,
        checkedIcon: <BoatIcon color="primary" />,
      },
    },
  ],
};

const extendableItems = ({pickers, name, label}) => {
  return [
    {
      component: componentTypes.SELECT,
      name,
      label,
      isReadOnly: false,
      isSearchable: true,
      isClearable: true,
      options: mapPicker(pickers[name]),
    },
    {
      component: componentTypes.TEXT_FIELD,
      condition: {
        when: name,
        isEmpty: true,
      },
      name: `new_${name}`,
      label: `a ${label.toLowerCase()} not listed`,
      isRequired: false,
    },
  ];
};

const builderItems = (pickers) => extendableItems({pickers, name: 'builder', label: 'Builder'})
const designerItems = (pickers) => extendableItems({pickers, name: 'designer', label: 'Designer'})
const designClassItems = (pickers) => extendableItems({pickers, name: 'design_class', label: 'Design Class'})

const cardForm = (pickers) => {
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
        dataType: "integer",
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

const summaryForm = (pickers) => {
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

const descriptionsForm = {
  title: "Edit Descriptions",
  name: "descriptions",
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
      component: "html",
      title: "Full description",
      name: "full_description",
      controls: ["title", "bold", "italic", "numberList", "bulletList", "link"],
    },
  ],
};

const LocationForm = {
  title: "Previous Names, Year and Location",
  name: "locations",
  component: componentTypes.SUB_FORM,
  fields: [
    {
      component: componentTypes.FIELD_ARRAY,
      name: "previous_names",
      label: "Previous name/s",
      fields: [{ component: "text-field" }],
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: "year",
      label: "Year Built",
      dataType: "integer",
    },
    {
      component: componentTypes.CHECKBOX,
      name: "year_is_approximate",
      label: "Approximate",
      dataType: "boolean",
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: "place_built",
      label: "Place built",
    },
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
  ],
};

const RegistrationForm = {
  title: "Registration And Location",
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

const constructionForm = (pickers) => {
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
      {
        component: componentTypes.SELECT,
        name: "construction_material",
        label: "Construction material",
        isReadOnly: false,
        isSearchable: true,
        isClearable: true,
        options: mapPicker(pickers.construction_material),
      },
      {
        component: componentTypes.SELECT,
        name: "construction_method",
        label: "Construction method",
        isReadOnly: false,
        isSearchable: true,
        isClearable: true,
        options: mapPicker(pickers.construction_method),
      },
      {
        component: componentTypes.TEXT_FIELD,
        name: "construction_details",
        label: "Construction details",
      },
    ],
  };
};

export const schema = (pickers) => {
  return {
    fields: [
      {
        component: componentTypes.WIZARD,
        name: "boat",
        fields: [
          {
            name: "activity-step",
            nextStep: ({ values }) => `${values.ddf.activity}-step`,
            fields: [activityForm],
          },
          {
            name: "card-step",
            nextStep: "done-step",
            fields: [cardForm(pickers)],
          },
          {
            name: "summary-step",
            nextStep: "references-step",
            fields: [summaryForm(pickers)],
          },
          {
            name: "references-step",
            nextStep: "done-step",
            fields: [
              {
                component: componentTypes.FIELD_ARRAY,
                name: "reference",
                label: "References in Gaffers Log, etc.",
                fields: [{ component: "text-field" }],
              },
            ],
          },
          {
            name: "descriptions-step",
            nextStep: "done-step",
            fields: [descriptionsForm],
          },
          {
            name: "locations-step",
            nextStep: "registrations-step",
            fields: [LocationForm],
          },
          {
            name: "registrations-step",
            nextStep: "done-step",
            fields: [RegistrationForm],
          },
          {
            name: "construction-step",
            nextStep: "done-step",
            fields: [constructionForm(pickers)],
          },
          {
            name: "dimensions-step",
            nextStep: ({ values }) => (values.generic_type === 'Dinghy') ? 'dinghy-hull-step' : 'yacht-hull-step',
            fields: [dimensionsForm],
          },
          {
            name: 'yacht-hull-step',
            nextStep: "done-step",
            fields: [
              {
                component: componentTypes.RADIO,
                name: "hull_form",
                label: "Hull Form",
                "options": [
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
          },
          {
            name: 'dinghy-hull-step',
            nextStep: "done-step",
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
          },
          {
            name: "rig-step",
            nextStep: "handicap-step",
            fields: [rigForm(pickers)]
          },
          ...handicap_steps,
          {
            name: "done-step",
            fields: [
              {
                component: componentTypes.PLAIN_TEXT,
                name: "ddf.we_are_done",
                label:
                  "Thanks for helping make the register better. An email address will let us discuss your suggestions with you.",
              },
              {
                component: componentTypes.TEXT_FIELD,
                name: "email",
                label: "email",
              },
            ],
          },
        ],
      },
    ],
  };
};

export default function EditBoat({ classes, onCancel, onSave, boat }) {
  const { loading, error, data } = usePicklists();

  if (loading) return <CircularProgress />;
  if (error) return <p>Error :(can't get picklists)</p>;

  const pickers = data;

  const state = { ...boatm2f(boat), ddf: { activity: "descriptions" } };

  const handleSubmit = (values) => {
    console.log("submit");
    const { ddf, ...result } = values;
    onSave({
      ...boat,
      ...boatf2m(result),
    });
  };

  return (
    <MuiThemeProvider theme={theme}>
      <FormRenderer
        schema={schema(pickers)}
        componentMapper={{
          ...componentMapper,
          "hull-form": HullForm,
          html: HtmlEditor,
        }}
        FormTemplate={(props) => (
          <FormTemplate {...props} showFormControls={false} />
        )}
        onCancel={onCancel}
        onSubmit={handleSubmit}
        initialValues={state}
      />
    </MuiThemeProvider>
  );
}
