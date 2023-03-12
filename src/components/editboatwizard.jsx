import React, { useEffect, useState } from "react";
import FormRenderer from "@data-driven-forms/react-form-renderer/form-renderer";
import componentMapper from "@data-driven-forms/mui-component-mapper/component-mapper";
import FormTemplate from "@data-driven-forms/mui-component-mapper/form-template";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import CircularProgress from '@mui/material/CircularProgress';
import {
  mapPicker,
  designerItems,
  builderItems,
  constructionItems,
} from "./ddf/util";
import { steps as handicap_steps } from "./Handicap";
import {
  yearItems,
  homeItems,
  registrationForm,
  descriptionsItems,
  referencesItems,
  yachtHullStep,
  dinghyHullStep,
} from "./ddf/SubForms";
import Typography from "@mui/material/Typography";
import { getPicklists } from './boatregisterposts';
import HtmlEditor from './ckeditor';
import { boatm2f } from "../util/format";

const schema = (pickers) => {
  return {
    fields: [
      {
        title: "Update Boat Record",
        component: 'wizard',
        name: "boat",
        fields: [
          {
            title: "Basic Details",
            name: "basic-step",
            nextStep: "build-step",
            fields: [
              {
                component: 'sub-form',
                name: "basic.form",
                title: "Basic Details",
                fields: [
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
                  },
                  {
                    component: 'select',
                    name: "generic_type",
                    label: "Generic Type",
                    isReadOnly: false,
                    isSearchable: true,
                    isClearable: true,
                    options: mapPicker(pickers.generic_type),
                  },
                ],
              },
            ],
          },
          {
            name: "build-step",
            nextStep: "design-step",
            fields: [
              {
                title: "Build",
                name: "build",
                component: 'sub-form',
                fields: [
                  ...yearItems,
                  {
                    component: 'text-field',
                    name: "place_built",
                    label: "Place Built",
                  },
                  ...builderItems(pickers),
                  {
                    component: 'text-field',
                    name: "hin",
                    label: "Hull Identification Number (HIN)",
                  },
                ],
              },
            ],
          },
          {
            name: "design-step",
            nextStep: "references-step",
            fields: [
              {
                title: "Design",
                name: "design",
                component: 'sub-form',
                fields: [
                  ...designerItems(pickers),
                  {
                    component: 'text-field',
                    name: "handicap_data.length_on_deck",
                    label: "Length on deck  (decimal feet)",
                    type: "number",
                    dataType: 'float',
                    isRequired: true,
                    validate: [
                      {
                        type: 'required',
                      },
                      /*{
                         type: 'min-number-value',
                         threshold: 5
                      }*/
                    ],
                  },
                  {
                    component: 'text-field',
                    name: "handicap_data.beam",
                    label: "Beam (decimal feet)",
                    type: "number",
                    dataType: 'float',
                    isRequired: true,
                    validate: [
                      {
                        type: 'required',
                      },
                      /*{
                        type: 'min-number-value',
                        threshold: 1,
                      }*/
                    ],
                  },
                  {
                    component: 'text-field',
                    name: "handicap_data.draft",
                    label: "Minumum Draft (decimal feet)",
                    type: "number",
                    dataType: 'float',
                    isRequired: true,
                    validate: [
                      {
                        type: 'required',
                      },
                      /*{
                       type: 'min-number-value',
                       threshold: 1
                      }*/
                    ],
                  },
                  {
                    component: 'text-field',
                    name: "air_draft",
                    label: "Air Draft (decimal feet)",
                    type: "number",
                    dataType: 'float',
                    validate: [
                      /*{
                        type: 'min-number-value',
                        threshold: 1
                      }*/
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: "references-step",
            nextStep: "previousnames-step",
            fields: [
              {
                name: "references",
                title: "References",
                component: 'sub-form',
                fields: referencesItems,
              },
            ],
          },
          {
            name: "previousnames-step",
            nextStep: "locations-step",
            fields: [
              {
                label: "Previous names",
                component: 'field-array',
                name: "previous_names",
                fields: [{ component: "text-field" }],
              },
            ],
          },
          {
            name: "locations-step",
            nextStep: "registrations-step",
            fields: [
              {
                title: "Locations",
                name: "locations",
                component: 'sub-form',
                fields: homeItems,
              },
            ],
          },
          {
            name: "registrations-step",
            nextStep: "construction-step",
            fields: [registrationForm],
          },
          {
            name: "construction-step",
            nextStep: ({ values }) =>
              ["Dinghy", "Dayboat"].includes(values.generic_type)
                ? "dinghy-hull-step"
                : "yacht-hull-step",
            fields: [
              {
                name: "construction",
                title: "Construction",
                component: 'sub-form',
                fields: constructionItems(pickers),
              },
            ],
          },
          yachtHullStep("skip-handicap-step"),
          dinghyHullStep("skip-handicap-step"),
          {
            name: "skip-handicap-step",
            nextStep: {
              when: "ddf.skip-handicap",
              stepMapper: {
                1: "handicap-step",
                2: "descriptions-step",
              },
            },
            fields: [
              {
                name: "skip-handicap",
                title: "Handicaps",
                component: 'sub-form',
                fields: [
                  {
                    component: 'radio',
                    name: "ddf.skip-handicap",
                    initialValue: "1",
                    label: 'Do you want a handicap?',
                    helperText: "There are some mandatory fields in the handicap section. If you don't need a handicap right now, you can skip this part.",
                    validate: [{ type: 'required' }],
                    options: [
                      { label: "I want a handicap", value: "1" },
                      { label: "I'll skip this for now",  value: "2" }
                    ],
                  },
                ],
              },
            ],
          },
          ...handicap_steps('handicap-step', 'descriptions-step'),
          {
            name: "descriptions-step",
            nextStep: 'done-step',
            component: 'sub-form',
            fields: [
              ...descriptionsItems,
            ],
          },
          {
            name: "done-step",
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
        ],
      },
    ],
  };
};

export default function EditBoatWizard({ boat, user, open, onCancel, onSubmit }) {
  const [pickers, setPickers] = useState();

  useEffect(() => {
    if (!pickers) {
      getPicklists().then((r) => setPickers(r.data)).catch((e) => console.log(e));
    }
  }, [pickers]);

  if (!pickers) return <CircularProgress />;

  if (!open) return '';

  const handleSubmit = ({ ddf, email, ...boat }) => {
    boat.designer = pickers.designer.find((item) => item.id === boat.designer);
    boat.builder = pickers.builder.find((item) => item.id === boat.builder);
    onSubmit(boat, email);
  }

  const flattenedBoat = boatm2f(boat);

  return (
    <Dialog
      open={open}
      aria-labelledby="form-dialog-title"
    >
      <Box sx={{ marginLeft: '1.5rem', marginTop: '1rem' }}>
        <Typography variant="h5" >Update {boat.name} ({boat.oga_no})</Typography>
      </Box>
      <FormRenderer
        componentMapper={{
          ...componentMapper,
          html: HtmlEditor,
        }}
        FormTemplate={(props) => (
          <FormTemplate {...props} showFormControls={false} />
        )}
        schema={schema(pickers)}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        initialValues={{ user, ...flattenedBoat }}
        subscription={{ values: true }}
      />

    </Dialog>
  );
}
