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
  ownerShipsForm,
  preSalesStep,
  salesSteps,
  setForSaleStep,
} from "./ddf/SubForms";
import Typography from "@mui/material/Typography";
import { getPicklists } from './boatregisterposts';
import HtmlEditor from './ckeditor';
import { boatm2f, boatf2m, boatDefined } from "../util/format";
import { currentSaleRecord } from "../util/sale_record";

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
                component: 'text-field',
                name: "ddf.selling",
                label: "can buy/sell",
                hideField: true,
              },
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
            component: 'sub-form',
            nextStep: 'skip-handicap-step',
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
            ],
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
                      { label: "I'll skip this for now", value: "2" }
                    ],
                  },
                ],
              },
            ],
          },
          ...handicap_steps('handicap-step', 'own-step'),
          ownerShipsForm('own-step', 'descriptions-step'),
          {
            component: 'sub-form',
            name: "descriptions-step",
            nextStep: {
              when: "ddf.can_sell",
              stepMapper: {
                true: 'query-sell-step',  // owner or editor and boat not for sale
                false: 'done-step',       // not owner or editor
              },
            },
            fields: descriptionsItems,
          },
          preSalesStep('query-sell-step', 'sell-step', 'done-step'),
          setForSaleStep('sell-step', 'done-step'),
          ...salesSteps('update-sell-step', 'done-step'),
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
                  console.log(values.ddf);
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
    update_sale: (boat.selling_status === 'for_sale') ? 'sell' : 'unsell',
  };
  const fs = currentSaleRecord(boat);
  if (fs) {
    ddf.current_sales_record = fs;
  }

  const handleSubmit = ({ ddf, email, designer, builder, ...changes }) => {
    const updates = { ...boat, ...boatf2m(changes) };

    updates.designer = pickers.designer.find((item) => item.id === designer);
    updates.builder = pickers.builder.find((item) => item.id === builder);

    // const np = newPicklistItems(result);
    // the following is because sail data might be skipped in the form
    const ohd = boat.handicap_data;
    const nhd = updates.handicap_data;
    updates.handicap_data = { ...ohd, ...nhd };

    const pfs = boat.for_sales.filter((f) => f.created_at !== fs?.created_at);
    switch (ddf.update_sale) {
      case 'sell':
        updates.selling_status = 'for_sale';
        updates.for_sales = [...pfs, ddf.current_sales_record];
        break;
      case 'unsell':
        updates.selling_status = 'not_for_sale';
        break;
      case 'sold':
        updates.selling_status = 'not_for_sale';
        updates.for_sales = [...pfs, ddf.current_sales_record];
        break;
      case 'update':
        updates.for_sales = [...pfs, ddf.current_sales_record];
        break;
      default:
        console.log('SELLING', ddf.update_sale)
    }
    if (updates.construction_method?.trim() === '') {
      delete updates.construction_method;
    }
    if (!updates.year_is_approximate) {
      delete updates.year_is_approximate;
    }
    const before = boatDefined(boat);
    const updatedBoat = { ...before, ...updates };
    // const { newItems } = np;

    console.log('Q', updatedBoat);
    onSubmit(updatedBoat, email);

  }

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
        initialValues={{ user, ...boatm2f(boat), ddf }}
        subscription={{ values: true }}
      />

    </Dialog>
  );
}
