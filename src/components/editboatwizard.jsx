import React, { useEffect, useState } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import enGB from "date-fns/locale/en-GB";
import { v4 as uuidv4 } from 'uuid';
import { create, formatters } from 'jsondiffpatch';
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
  designClassItems,
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
                  ...designClassItems(pickers),
                  {
                    component: 'text-field',
                    name: "handicap_data.length_on_deck",
                    label: "Length on deck (decimal feet)",
                    type: "number",
                    dataType: 'float',
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
                label: "New name",
                component: 'text-field',
                name: "ddf.new_name",
                description: 'if you have changed the name, enter the new name here.'
              },
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

export function boatdiff(before, after) {
  const cj = create({ objectHash: (obj) => `${obj.id || obj.name}-${obj.start}`});
  return cj.diff(before, after);
}

export function salesChanges(ddf) {
  const changes = {};

  switch (ddf.update_sale) {
    case 'unsell':
    case 'sold':
    case undefined:
      changes.selling_status = 'not_for_sale';
      break;
    case 'update':
      changes.selling_status = 'for_sale';
      break;
    default:
      if (ddf.confirm_for_sale && ddf.current_sales_record) {
        changes.selling_status = 'for_sale';
      } else {
        console.log('handleSubmit unexpected update_sale value', ddf);
      }
  }

  changes.for_sales = [...(ddf.other_sales || []), ddf.current_sales_record].filter((s) => s);
  return changes;
}

export default function EditBoatWizard({ boat, user, open, onCancel, onSubmit }) {
  const [pickers, setPickers] = useState();

  useEffect(() => {
    if (!pickers) {
      getPicklists().then((r) => setPickers(r.data)).catch((e) => console.log(e));
    }
  }, [pickers]);

  if (!pickers) return <CircularProgress />;

  if (!open) return '';

  const ownerids = boat.ownerships?.filter((o) => o.current)?.map((o) => o.id) || [];
  const goldId = user?.['https://oga.org.uk/id'];
  const editor = (user?.['https://oga.org.uk/roles'] || []).includes('editor');
  const owner = ownerids.includes[goldId];
  const { name, oga_no, id, image_key, for_sales, for_sale_state, ...rest } = boat;

  const handleSubmit = (values, formApi) => {
    const { ddf, email, ...submitted } = values;
    const { initialValues } = formApi.getState();
    [
      'ddf', 'email', 'user',
    ].forEach((key) => delete initialValues[key]);

    const u = {
      ...boatf2m(submitted),
      name: ddf.new_name || name,
      previous_names: [
        ...((ddf.new_name && [name]) || []),
        ...(submitted.previous_names||[]),
      ],
      oga_no, id, image_key,
      ...salesChanges(ddf),
    };
    const newItems = {};
    ['builder', 'designer', 'design_class'].forEach((key) => {
      const new_val =  ddf[`new_${key}`];
      if (new_val) {
        u[key] = newItems[key] = { name: new_val, id: uuidv4() };
      } else {
        u[key] = pickers[key].find((p) => p.name === u[key]);
      }
    });
    console.log('newItems', newItems);

    const fulldelta = formatters.jsonpatch.format(boatdiff(boat, u));
    console.log('delta', fulldelta);
    console.log(boatDefined(u));

    onSubmit(
      fulldelta,
      newItems,
      boatDefined(u),
      email,
    );
  }

  const sortedsales = for_sales?.sort((a, b) => a.created_at < b.created_at) || [];

  const initialValues = {
    user,
    ...boatm2f(rest),
    ddf: {
      name, oga_no, id, image_key, 
      can_sell: !!(owner || editor),
      update_sale: (boat.selling_status === 'for_sale') ? 'update' : 'unsell',
      current_sales_record: sortedsales[0],
      other_sales: sortedsales.slice(1),
    },
  };

  ['builder', 'designer', 'design_class'].forEach((key) => {
    initialValues[key] = initialValues[key]?.name;
  });

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
