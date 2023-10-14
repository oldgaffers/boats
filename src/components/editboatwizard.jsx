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
import HtmlEditor from './tinymce';
import { boatm2f, boatf2m, boatDefined } from "../util/format";

const defaultSchema = (pickers) => {
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
  const cj = create({
    objectHash: (obj) => `${obj.id || obj.name}-${obj.start}`,
    textDiff: { minLength: 60000 }, // prevent textdiff not supported by the RFC formatter
  });
  return cj.diff(before, after);
}

export function salesChanges(ddf) {

  console.log()
  let selling_status = 'not_for_sale';

  switch (ddf.update_sale) {
    case 'unsell':
    case 'sold':
      selling_status = 'not_for_sale';
      break;
    case 'update':
      selling_status = 'for_sale';
      break;
    default:
      if (ddf.confirm_for_sale && ddf.current_sales_record) {
        selling_status = 'for_sale';
      } else {
        console.log('handleSubmit unexpected update_sale value', ddf);
      }
  }

  const fs = [...(ddf.other_sales || []), ddf.current_sales_record];

  const for_sales = fs.filter((s) => s);

  return { for_sales, selling_status };
}

export function prepareInitialValues(boat, user) {
  const ownerids = boat.ownerships?.filter((o) => o.current)?.map((o) => o.id) || [];
  const goldId = user?.['https://oga.org.uk/id'];
  const editor = (user?.['https://oga.org.uk/roles'] || []).includes('editor');
  const owner = ownerids.includes[goldId];
  const { name, oga_no, id, image_key, for_sales, for_sale_state, ...rest } = boat;


  const sortedsales = for_sales?.sort((a, b) => a.created_at < b.created_at) || [];

  const initialValues = {
    email: user?.email || '',
    ...boatm2f(rest),
    ddf: {
      name, oga_no, id, image_key,
      can_sell: !!(owner || editor),
      update_sale: (boat.selling_status === 'for_sale') ? 'update' : 'unsell',
      current_sales_record: { asking_price: 0, sales_text: '', flexibility: 'normal' },
      other_sales: sortedsales,
    },
  };

  if (boat.selling_status === 'for_sale') {
    initialValues.ddf.current_sales_record = sortedsales[0];
    initialValues.ddf.other_sales = sortedsales.slice(1)    
  }

  ['builder', 'designer'].forEach((key) => {
    const val = initialValues[key];
    if (Array.isArray(val)) {
      initialValues[key] = val.map((v) => v.name);
    } else if (val) {
      initialValues[key] = [val.name]
    } else {
      initialValues[key] = [];
    }
  });

  ['design_class'].forEach((key) => {
    initialValues[key] = initialValues[key]?.name;
  });

  return initialValues;

}

export function prepareModifiedValues(values, { name, oga_no, id, image_key }, pickers) {
  const { ddf, email, ...submitted } = values;

  const newItems = Object.fromEntries(
    ['builder', 'designer', 'design_class']
      .filter((key) => ddf[`new_${key}`])
      .map((key) => {
        return { name: ddf[`new_${key}`], id: uuidv4() };
      })
  );

  function name2object(value, picker, newItem) {
    if (value === newItem?.name) {
      return newItem;
    }
    const r = picker.find((p) => p.name === value);
    if (r) {
      return r;
    }
    console.log(`${value} is missing in picklist, making a new uuid`);
    return { name: value, id: uuidv4() };
  }

  const design_class = name2object(values.design_class, pickers['design_class'], newItems['design_class']);

  const builder = values.builder.map((v) =>  name2object(v, pickers['builder'], newItems['builder']));
  const designer = values.designer.map((v) =>  name2object(v, pickers['designer'], newItems['designer']));

  const boat = {
    ...boatf2m(submitted),
    name: ddf.new_name || name,
    previous_names: [
      ...((ddf.new_name && [name]) || []),
      ...(submitted.previous_names || []),
    ],
    oga_no, id, image_key,
    ...salesChanges(ddf),
    builder,
    designer,
    design_class,
  };

  return { boat: boatDefined(boat), newItems, email };
}

export default function EditBoatWizard({ boat, user, open, onCancel, onSubmit, schema }) {

  const [pickers, setPickers] = useState();

  const handleSubmit = (values, formApi) => {

    const { newItems, email, boat: modifiedBoat } = prepareModifiedValues(values, boat, pickers);

    const fulldelta = formatters.jsonpatch.format(boatdiff(boat, modifiedBoat));

    onSubmit(
      fulldelta,
      newItems,
      modifiedBoat,
      email,
    );
  }

  useEffect(() => {
    if (!pickers) {
      getPicklists().then((r) => {
        setPickers(r)
      }).catch((e) => console.log(e));
    }
  }, [pickers]);

  if (!pickers) return <CircularProgress />;

  if (!open) return '';

  const activeSchema = schema || defaultSchema(pickers);

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
          schema={activeSchema}
          onSubmit={handleSubmit}
          onCancel={onCancel}
          initialValues={prepareInitialValues(boat, user)}
          subscription={{ values: true }}
        />
      </LocalizationProvider>

    </Dialog>
  );
}
