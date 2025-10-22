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
  basicDimensionItems,
  GenericTypeItems,
} from "./ddf/util";
import { steps as handicap_steps } from "./Handicap";
import {
  yearItems,
  homeItems,
  registrationForm,
  referencesItems,
  salesSteps,
  // ownershipUpdateFields,
  sellingDataFields,
  doneFields,
  hullFields,
  descriptionsItems,
  rigFields,
} from "./ddf/SubForms";
import OwnershipForm, { ownershipUpdateFields } from "./ownershipupdateform";
import Typography from "@mui/material/Typography";
import { getPicklists } from '../util/api';
import HtmlEditor from './tinymce';
import { boatm2f, boatf2m, boatDefined } from "../util/format";
import { useAuth0 } from '@auth0/auth0-react';

const defaultSchema = (pickers) => {
  return {
    fields: [
      {
        title: "Update Boat Record",
        component: 'wizard',
        name: "boat",
        fields: [
          {
            name: "rig-step",
            nextStep: "type-step",
            fields: [
              {
                component: 'text-field',
                name: "ddf.owner",
                label: "is current owner",
                hideField: true,
              },
              {
                component: 'text-field',
                name: "ddf.editor",
                label: "is editor",
                hideField: true,
              },
              {
                component: 'sub-form',
                name: "rig.form",
                title: "Rig",
                fields: rigFields(pickers),
              },
            ],
          },
          {
            name: "type-step",
            nextStep: "descriptions-step",
            fields: [
              ...GenericTypeItems(pickers),
              {
                component: 'plain-text',
                name: 'gt-desc',
                label: 'Most boats will only have one, but a Nobby can be a yacht too, for example',
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
            nextStep: "basic-dimensions-step",
            fields: [
              {
                title: "Design",
                name: "design",
                component: 'sub-form',
                fields: [
                  ...designerItems(pickers),
                  ...designClassItems(pickers),
                ],
              },
            ],
          },
          {
            name: "basic-dimensions-step",
            nextStep: "references-step",
            fields: [
              {
                title: "Basic Dimensions",
                name: "basic-dimensions",
                component: 'sub-form',
                fields: basicDimensionItems,
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
                      { label: "I want to add or check handicap data", value: "1" },
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
              if (values.ddf.owner || values.ddf.editor) {
                if (values.selling_status === 'for_sale') {
                  return 'update-sell-step';
                }
                return 'query-sell-step';
              }
              return 'done-step';
            },
            fields: ownershipUpdateFields,         
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
                initialValue: values.selling_status === 'for_sale',
                isReadOnly: !(values.ddf.owner || values.ddf.editor)
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

export function prepareInitialValues(boat, user) {
  const ownerids = boat.ownerships?.filter((o) => o.current)?.map((o) => o.id) || [];
  const goldId = user?.['https://oga.org.uk/id'];
  const editor = (user?.['https://oga.org.uk/roles'] || []).includes('editor');
  const owner = (!!goldId) && ownerids.includes(goldId);
  const { name, oga_no, id, image_key, for_sales, for_sale_state, ...rest } = boat;
  const email = user?.email || '';

  const ddf = { name, oga_no, id, image_key, owner, editor };

  const defaultSalesRecord = {
    created_at: new Date().toISOString(),
    asking_price: 0,
    sales_text: '',
    flexibility: 'normal',
  };

  const sales_records = [...(for_sales || [])].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));

  if (boat.selling_status === 'for_sale') {
    ddf.current_sales_record = { ...defaultSalesRecord, ...sales_records.shift() };
  } else {
    ddf.current_sales_record = defaultSalesRecord;
  }
  
  const initialValues = { ddf, email, ...boatm2f(rest) };

  // prepare for dual-list
  ['builder', 'designer'].forEach((key) => {
    const val = initialValues[key];
    if (val) {
      initialValues[key] = val.filter((v) => v).map((v) => v?.name);
    } else {
      initialValues[key] = [];
    }
  });
  ['design_class'].forEach((key) => {
    initialValues[key] = initialValues[key]?.name;
  });

  const ownersWithId = (boat.ownerships || [])
  .filter((owner) => owner.name || owner.id) // remove note and text rows
  .map((owner, index) => {
    return {
        ...owner,
        id: index,
        goldId: owner.id, // needed for ownerName? name has already been merged in!!!
    };
  });

  initialValues.ownerships = ownersWithId;

  // ownersWithId.sort((a, b) => a.start > b.start);
// console.log('IV', initialValues)

  return initialValues;

}

export function salesChanges(ddf, for_sales) {
  if (ddf.update_sale === 'update') {
    return {
      selling_status: 'for_sale',
      for_sales: [ddf.current_sales_record, ...for_sales],
    }
  }
  if (ddf.update_sale === 'unsell') {
    return {
      selling_status: 'not_for_sale',
      for_sales: [ddf.current_sales_record, ...for_sales],
    }
  }
  if (ddf.update_sale === 'sold') {
    return {
      selling_status: 'not_for_sale',
      for_sales: [ddf.current_sales_record, ...for_sales],
    }
  }
  if (ddf.confirm_for_sale === true) {
    return {
      selling_status: 'for_sale',
      for_sales: [ddf.current_sales_record, ...for_sales],
    }    
  }
  return { for_sales };
}

export function updateOwnerships(old, updated) {
  const notes = old.filter((o) => !(o.name || o.id))
  // console.log(notes, updated);
  const withoutRowIds = updated.map((o) => {
    const { id, goldId, ...rest } = o;
    if (goldId) {
      rest.id = goldId;
    }
    return rest;
  })
  return [...withoutRowIds, ...notes];
}

export function prepareModifiedValues(values, boat, pickers) {
  const { name, oga_no, id, image_key, selling_status, for_sales } = boat
  const { ddf, email, ownerships, ...submitted } = values;

  const sales_records = [...(for_sales || [])].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));

  if (selling_status === 'for_sale') {
    sales_records.shift();
  }

  const newItems = Object.fromEntries(
    ['builder', 'designer', 'design_class']
      .filter((key) => ddf[`new_${key}`])
      .map((key) => {
        return [key, { name: ddf[`new_${key}`], id: uuidv4() }];
      })
  );

  function name2object(value, picker, newItem) {
    console.log('name2object', value, newItem);
    if (newItem) {
      return newItem;
    }
    if (value?.name) {
      return value;
    }
    const r = picker.find((p) => p.name === value);
    if (r) {
      return r;
    }
    return undefined; // not possible to specify a value we don't have
  }

  function listMapper(values, newItems, field) {
    if (values[field]) {
      const r = values[field].map((v) => name2object(v, pickers[field]));
      if (newItems[field]) {
        r.push(newItems[field]);
      }
      return r;
    } else {
      if (newItems[field]) {
        return [newItems[field]];
      }
    }
    return undefined;
  }

  const design_class = name2object(values.design_class, pickers.design_class, newItems.design_class);

  const builder = listMapper(values, newItems, 'builder');
  const designer = listMapper(values, newItems, 'designer');

  const modifiedBoat = {
    ...boatf2m(submitted),
    ownerships: updateOwnerships(boat.ownerships, ownerships),
    name: ddf.new_name || name,
    previous_names: [
      ...((ddf.new_name && [name]) || []),
      ...(submitted.previous_names || []),
    ],
    oga_no, id, image_key,
    ...salesChanges(ddf, sales_records),
    builder,
    designer,
    design_class,
  };

  return { boat: boatDefined(modifiedBoat), newItems, email };
}

export function oldvalue(path, boat) {
  const [, root, ...p] = path.split('/');
  return p.reduce((prev, current) => prev[current], boat[root]);
}

export default function EditBoatWizard({ boat, open, onCancel, onSubmit, schema }) {

  const [pickers, setPickers] = useState();
  const { user } = useAuth0();

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

  const handleSubmit = (values, formApi) => {

    // console.log('handleSubmit handicap data', values.handicap_data);
    const state = formApi.getState()
    // console.log('handleSubmit handicap data from state', state.values.handicap_data);

    // N.B. the values from the values parameter can be incomplete.
    // the values in the state seem correct

    const { newItems, email, boat: modifiedBoat } = prepareModifiedValues(state.values, boat, pickers);

    const rounded = boatf2m(boatm2f(boat)); // to exclude changes due to rounding
    const fulldelta = formatters.jsonpatch.format(boatdiff(rounded, modifiedBoat));

    onSubmit(
      fulldelta,
      newItems,
      modifiedBoat,
      email,
    );

  }


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
            'ownership-form': OwnershipForm,
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
