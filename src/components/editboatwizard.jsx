import React, { useEffect, useState } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import enGB from "date-fns/locale/en-GB";
import FormRenderer from "@data-driven-forms/react-form-renderer/form-renderer";
import componentMapper from "@data-driven-forms/mui-component-mapper/component-mapper";
import FormTemplate from "@data-driven-forms/mui-component-mapper/form-template";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import CircularProgress from '@mui/material/CircularProgress';
import {
  designerItems,
  builderItems,
  constructionItems,
} from "./ddf/util";
import { steps as handicap_steps } from "./Handicap";
import {
  yearItems,
  homeItems,
  registrationForm,
  referencesItems,
  salesSteps,
  ownerShipsFields,
  sellingDataFields,
  doneFields,
  hullFields,
  descriptionsItems,
  basicFields,
} from "./ddf/SubForms";
import Typography from "@mui/material/Typography";
import { getPicklists } from './boatregisterposts';
import HtmlEditor from './ckeditor';
import { boatm2f, boatf2m, boatDefined } from "../util/format";
import { newPicklistItems } from "./createboatbutton";

const schema = (pickers) => {
  return {
    fields: [
      {
        title: "Update Boat Record",
        component: 'wizard',
        name: "boat",
        fields: [
          {
            name: "basic-step",
            nextStep: "descriptions-step",
            fields: [
              {
                component: 'text-field',
                name: "ddf.can_sell",
                label: "can buy/sell",
                hideField: true,
              },
              {
                component: 'sub-form',
                name: "basic.form",
                title: "Basic Details",
                fields: basicFields(pickers),
              },
            ],
          },
          {
            name: "descriptions-step",
            nextStep: 'build-step',
            fields: descriptionsItems,
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
                    component: 'select',
                    name: 'design_class',
                    label: 'Design Class',
                    isReadOnly: false,
                    isSearchable: true,
                    isClearable: true,
                    noOptionsMessage: 'we don\'t have that class - you can add it as a new one below',
                    options: pickers['design_class'].map((i) => ({ label: i.name, value: i.name })),
                  },
                  {
                    component: 'text-field',
                    name: 'new_design_class',
                    label: 'New design class',
                    helperText: 'if the design class is not listed and you know the name add it here',
                    isRequired: false,
                    condition: {
                      when: 'design_class',
                      isEmpty: true,
                    },
                  },
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
            nextStep: 'hull-step',
            fields: [
              {
                name: "construction",
                title: "Construction",
                component: 'sub-form',
                fields: constructionItems(pickers),
              },
            ],
          },
          {
            name: "hull-step",
            nextStep: 'skip-handicap-step',
            fields: hullFields,
          },
          {
            name: "skip-handicap-step",
            nextStep: {
              when: "ddf.skip-handicap",
              stepMapper: {
                1: "handicap-step",
                2: "own-step",
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
                    label: 'Do you want to create or update a handicap?',
                    helperText: "There are some mandatory fields in the handicap section. If you don't need a handicap right now, you can skip this part.",
                    validate: [{ type: 'required' }],
                    options: [
                      { label: "I want to add handicap data", value: "1" },
                      { label: "I'll leave it for now", value: "2" }
                    ],
                  },
                ],
              },
            ],
          },
          ...handicap_steps('handicap-step', 'own-step'),
          {
            name: 'own-step',
            nextStep: ({ values }) => {
              if (values.ddf.can_sell) {
                if (values.ddf.update_sale === 'update') {
                  return 'update-sell-step';
                }
                return 'query-sell-step';
              }
              return 'done-step';
            },
            fields: ownerShipsFields,
          },
          {
            name: 'query-sell-step',
            nextStep: {
              when: "ddf.confirm_for_sale",
              stepMapper: {
                true: 'sell-step',
                false: 'done-step',
              },
            },
            fields: [
              {
                component: 'checkbox',
                label: 'I want to sell this boat',
                name: 'ddf.confirm_for_sale',
                helperText: 'check if you want to put this boat up for sale',
                resolveProps: (props, { meta, input }, formOptions) => {
                  const { values } = formOptions.getState();
                  return {
                    initialValue: !!values.ddf.current_sales_record,
                    isReadOnly: !values.ddf.can_sell
                  }
                },
              },
            ],
          },
          {
            name: 'sell-step',
            nextStep: 'done-step',
            fields: sellingDataFields,
          },
          ...salesSteps('update-sell-step', 'done-step'),
          {
            name: "done-step",
            fields: doneFields,
          },
        ],
      },
    ],
  };
};

export default function EditBoatWizard({ boat, user, open, onCancel, onSubmit }) {
  const [pickers, setPickers] = useState();

  // const oga_no = boat.oga_no; // this gets lost somewhere
  // const name = boat.name; // this also gets lost somewhere

  useEffect(() => {
    if (!pickers) {
      getPicklists().then((r) => setPickers(r.data)).catch((e) => console.log(e));
    }
  }, [pickers]);

  if (!pickers) return <CircularProgress />;

  if (!open) return '';

  const ownerids = boat.ownerships?.filter((o) => o.current)?.map((o) => o.id) || [];
  const goldId = user?.['https://oga.org.uk/id'];
  // const member = user?.['https://oga.org.uk/member'];
  const editor = (user?.['https://oga.org.uk/roles'] || []).includes('editor');
  const owner = ownerids.includes[goldId];

  const ddf = {
    can_sell: !!(owner || editor),
    update_sale: (boat.selling_status === 'for_sale') ? 'update' : 'unsell',
  };
  const fs = boat.for_sales?.sort((a, b) => a.created_at < b.created_at)?.[0];
  if (fs) {
    ddf.current_sales_record = fs;
  }

  const handleSubmit = ({ ddf, email, designer, builder, ...changes }) => {
    const updates = { ...boat, ...boatf2m(changes) };

    updates.designer = pickers.designer.find((item) => item.id === designer);
    updates.builder = pickers.builder.find((item) => item.id === builder);

    const np = newPicklistItems(changes);
    // the following is because sail data might be skipped in the form
    const ohd = boat.handicap_data;
    const nhd = updates.handicap_data;
    updates.handicap_data = { ...ohd, ...nhd };

    const pfs = boat.for_sales?.filter((f) => f.created_at !== fs?.created_at) || [];
    switch (ddf.update_sale) {
      case 'unsell':
        updates.selling_status = 'not_for_sale';
        break;
      case 'sold':
        updates.selling_status = 'not_for_sale';
        updates.for_sales = [...pfs, ddf.current_sales_record];
        break;
      case 'update':
        updates.selling_status = 'for_sale';
        updates.for_sales = [...pfs, ddf.current_sales_record];
        break;
      default:
        console.log('handleSubmit unexpected update_sale value', ddf.update_sale);
    }
    if (updates.construction_method?.trim() === '') {
      delete updates.construction_method;
    }
    if (!updates.year_is_approximate) {
      delete updates.year_is_approximate;
    }
    const before = boatDefined(boat);
    const { newItems } = np;
    const updatedBoat = { ...before, ...updates, newItems };
    onSubmit(updatedBoat, email);

  }
  const initialValues = { user, ...boatm2f(boat), ddf };

  return (
    <Dialog
      open={open}
      aria-labelledby="form-dialog-title"
    >
      <Box sx={{ marginLeft: '1.5rem', marginTop: '1rem' }}>
        <Typography variant="h5" >Update {boat.name} ({boat.oga_no})</Typography>
      </Box>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
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
          initialValues={initialValues}
          subscription={{ values: true }}
        />
      </LocalizationProvider>

    </Dialog>
  );
}
