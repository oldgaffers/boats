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
  extendableList,
  designerItems,
  builderItems,
  constructionItems,
  designClassItems,
  basicDimensionItems,
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
import { getPicklists, nextOgaNo, openPr } from '../util/api';
import HtmlEditor from './ddf/trix';
import { useAuth0 } from '@auth0/auth0-react';
import { prepareInitialValues, prepareModifiedValues } from '../../src/components/editboatwizardfunctions';

const defaultSchema = (pickers, isNew = false) => {
  const fields = [
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
          component: 'checkbox',
          name: 'ddf.pr',
          hideField: true,
        },
        {
          component: 'plain-text',
          name: 'ddf.pr.label',
          label: <Typography>
            You are editing the latest proposed values, so some fields will
            already be different from the currently published ones.</Typography>,
          condition: { when: 'ddf.pr', is: true },
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
        ...extendableList(pickers, 'generic_type', 'Generic Type', true),
        {
          component: 'plain-text',
          name: 'gt-desc',
          label: <Typography>Most boats will only have one,
            but a Nobby can be a yacht too, for example.
            Pick one, and you can pick more if you need to.
            Type to filter the options. If you type something that doesn't exist,
            you can add it as a new generic type.
          </Typography>
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
              component: 'plain-text',
              name: 'b-desc',
              label: <Typography>Most boats will only have one,
                but a boat could be home finished from a production hull, for example.
                Pick one, and you can pick more if you need to.
                Type to filter the options. If you type something that doesn't exist,
                you can add them as a new builder.
              </Typography>
            },
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
            {
              component: 'plain-text',
              name: 'd-desc',
              label: <Typography>Most boats will only have one,
                but a boat could be based on another design, for example.
                Pick one, and you can pick more if you need to.
                Type to filter the options. If you type something that doesn't exist,
                you can add them as a new designer.
              </Typography>
            },
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
  ];
  if (isNew) {
    fields.unshift({
      name: "name-step",
      nextStep: "rig-step",
      fields: [
        {
          component: 'text-field',
          name: 'name',
          label: 'Boat Name',
          isRequired: true,
          validate: [{ type: 'required' }],
        }]
    });
  }
  return {
    fields: [
      {
        title: "Update Boat Record",
        component: 'wizard',
        name: "boat",
        fields,
      },
    ],
  };
};

function EditWiz({ boat, onCancel, onSubmit, schema, pr }) {
  const [pickers, setPickers] = useState();
  const [data, setData] = useState(boat);
  const { user } = useAuth0();

  useEffect(() => {
    if (!data.oga_no) {
      nextOgaNo().then((no) => {
        setData({ ...data, oga_no: no });
      }).catch((e) => console.log(e));
    }
  }, [data, boat]);

  useEffect(() => {
    if (!pickers) {
      getPicklists().then((r) => {
        setPickers(r)
      }).catch((e) => console.log(e));
    }
  }, [pickers]);

  if (!pickers) return <CircularProgress />;

  const activeSchema = schema || defaultSchema(pickers, !data.name);

  const handleSubmit = (_, formApi) => {

    const state = formApi.getState()

    // N.B. the values from the values parameter can be incomplete.
    // the values in the state seem correct

    const { newItems, email, boat } = prepareModifiedValues(state.values, data, pickers);

    onSubmit(
      newItems,
      boat,
      email,
    );

  }

  return <FormRenderer
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
    initialValues={prepareInitialValues(data, user, pr)}
    subscription={{ values: true }}
  />;
}

function EditBoatWizardDialog({ boat, open, onCancel, onSubmit, schema, pr }) {

  const title = boat.name ? `Update ${boat.name} (${boat.oga_no})` : 'Add New Boat';
  return (
    <Dialog
      open={open}
      aria-labelledby="form-dialog-title"
    >
      <Box sx={{ marginLeft: '1.5rem', marginTop: '1rem' }}>
        <Typography variant="h5" >{title}</Typography>
      </Box>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
        <EditWiz
          onCancel={onCancel}
          onSubmit={onSubmit}
          boat={boat}
          schema={schema}
          pr={pr}
        />
      </LocalizationProvider>

    </Dialog>
  );
}

export default function EditBoatWizard({ boat, open, onCancel, onSubmit, schema }) {

  const [data, setData] = useState();
  const [pr, setPr] = useState(false);

  useEffect(() => {
    if (!open) {
      setData(undefined);
    } else if (!data) {
      openPr(boat.oga_no).then((modified) => {
        if (modified) {
          setData(modified);
          setPr(true);
        } else {
          setData(boat);
        }
      });
    }
  }, [open, data, boat]);
  if (data) {
    return <EditBoatWizardDialog boat={data} open={open} onCancel={onCancel} onSubmit={onSubmit} schema={schema} pr={pr} />;
  }
  if (open) {
    return <CircularProgress />;
  }
  return '';
}
