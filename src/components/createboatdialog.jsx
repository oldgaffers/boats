
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import FormSpy from '@data-driven-forms/react-form-renderer/form-spy';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import FormRenderer from "@data-driven-forms/react-form-renderer/form-renderer";
import componentMapper from "@data-driven-forms/mui-component-mapper/component-mapper";
import FormTemplate from "@data-driven-forms/mui-component-mapper/form-template";
import Box from "@mui/material/Box";
import {
  designerItems,
  builderItems,
  constructionItems,
  basicDimensionItems,
  GenericTypeItems,
} from "./ddf/util";
import { steps as handicap_steps } from "./Handicap";
import {
  yearItems,
  homeItems,
  registrationForm,
  descriptionsItems,
  referencesItems,
  hullFields,
  rigFields,
} from "./ddf/SubForms";
import Typography from "@mui/material/Typography";
import { getBoatData, getFilterable, getPicklists } from '../util/api';
import Photodrop from "./photodrop";
import HtmlEditor from './tinymce';
import { boatm2f } from "../util/format";

const schema = (pickers) => {
  return {
    fields: [
      {
        component: 'field-listener',
        name: 'listener',
        hideField: true,
      },
      {
        component: 'sub-form',
        name: 'filterable',
        hideField: true,
        fields: [],
      },
      {
        title: "New Boat Record",
        component: 'wizard',
        name: "boat",
        fields: [
          {
            name: "check-step",
            nextStep: "prefill-step",
            fields: [
              {
                component: 'plain-text',
                name: "ddf.dc.check1",
                label: "If the boat you want to add has an OGA Number it is already on the register."
                  + " Over 3,000 boats already are."
              },
              {
                component: 'plain-text',
                name: "ddf.dc.check2",
                label: "You can search the register by the current or a previous name or by OGA Number."
                  + " Or you can filter by age, length, type, etc.",
              },
              {
                component: 'plain-text',
                name: "ddf.dc.check3",
                label: "If you can find the boat on the register, please click on the MORE button on the boat's card."
                  + " Then use the ADD PICTURES or the I HAVE EDITS buttons instead of using this form."
              },
              {
                component: 'plain-text',
                name: "ddf.dc.check4",
                label: " If you aren't sure, please contact the boat register editors."
              },
              {
                component: 'checkbox',
                name: "ddf.owned",
                label: "I'm a current owner of this boat.",
                helperText: 'anyone can suggest a new boat for the register',
              },
              {
                component: 'checkbox',
                name: 'ddf.have_pictures',
                label: 'I have pictures to upload',
                initialValue: true,
                helperText: 'pictures are really important',
              },
              {
                component: 'checkbox',
                name: "ddf.dc.isnew",
                label: "I've checked and the boat isn't already on the register.",
                isRequired: true,
                validate: [{ type: 'required' }],
              },
            ]
          },
          {
            name: "prefill-step",
            nextStep: ({ values }) => {
              if (values.ddf) {
                if (values.ddf.have_pictures) {
                  return 'picture-step';
                }
                if (values.ddf.owned) {
                  return 'owner-step';
                }
              }
              return 'basic-step';
            },
            fields: [
              {
                component: 'sub-form',
                name: 'ddf.dc',
                fields: [
                  {
                    component: 'plain-text',
                    name: "ddf.dc.desc",
                    label: " Fields marked with a * are mandatory, everything else is optional."
                      + " Once your boat has an entry you can add more pictures and information."
                      + " As a minimum, we'd like a name, picture, rig type, mainsail type, length, beam and short description."
                    ,
                  },
                  {
                    component: 'text-field',
                    name: "name",
                    label: "the name of the boat",
                    helperText: 'if the boat has had other names in the past they can be added later in this form',
                    type: "string",
                    dataType: 'string',
                    isRequired: true,
                    validate: [
                      {
                        type: 'required',
                      },
                    ],
                  },
                  {
                    component: 'select',
                    name: 'design_class',
                    label: 'Design Class',
                    helperText: 'If your boat is in a design class we have data for, will pre-fill the form from another boat in the class.'
                      + ' You will be able to change the values as boats do vary within a class.'
                      + ' If we don\'t have your design class you can add it once the boat is created.',
                    isReadOnly: false,
                    isSearchable: true,
                    isClearable: true,
                    noOptionsMessage: 'we don\'t have that class - you can add it as a new one below',
                    options: (pickers?.design_class||[]).map((i) => ({ label: i.name, value: i.name })),
                  },
                ]
              }
            ]
          },
          {
            name: "picture-step",
            nextStep: ({ values }) => {
              if (values.ddf) {
                if (values.ddf.owned) {
                  return 'owner-step';
                }
              }
              return 'basic-step';
            },
            fields: [
              {
                name: "ddf.picture",
                component: 'sub-form',
                fields: [
                  {
                    component: 'plain-text',
                    name: "ddf.picture.desc",
                    label: "Please add some pictures, ideally of her sailing."
                      + " If you have more than one picture upload the best one(s) here."
                      + " You will be able to add more pictures later from the boat's detail page.",
                  },
                  {
                    component: "pic",
                    name: "ddf.fileList",
                  },
                  {
                    component: 'text-field',
                    name: "ddf.copyright",
                    label: "copyright owner",
                    helperText: "All the pictures you add now must have the same copyright owner",
                    isRequired: true,
                    validate: [{ type: 'required' }],
                    resolveProps: (props, { meta, input }, formOptions) => {
                      const { values } = formOptions.getState();
                      const user = values.user;
                      return { initialValue: user && user.name };
                    },
                  },
                ],
              },
            ],
          },
          {
            name: "owner-step",
            nextStep: "basic-step",
            fields: [
              {
                component: 'sub-form',
                title: 'Current Owners',
                name: 'owners',
                fields: [
                  {
                    component: 'text-field',
                    name: "ddf.owner.name",
                    label: "Name",
                    resolveProps: (props, { meta, input }, formOptions) => {
                      const { values } = formOptions.getState();
                      return {
                        initialValue: values.user?.name || '',
                      };
                    },
                    isRequired: true,
                    validate: [{ type: 'required' }],
                    sx: { marginTop: 2 },
                  },
                  {
                    component: 'text-field',
                    name: "ddf.owner.start",
                    label: "Start Year",
                    isRequired: true,
                    validate: [{ type: 'required' }],
                  },
                  {
                    component: 'checkbox',
                    name: 'ddf.owner.part',
                    label: 'This is a joint ownership',
                    initialValue: false,
                    helperText: 'You can add other current owners here. Once the boat is created you will be able to add more details.'
                  },
                  {
                    component: 'field-array',
                    name: 'ddf.otherowners',
                    label: 'Other current owners',
                    fields: [
                      { component: 'text-field', name: 'name', label: 'Name' },
                    ],
                    condition: {
                      when: 'ddf.owner.part',
                      is: true,
                    }
                  },
                ],
              },
            ],
          },
          {
            name: "rig-step",
            nextStep: "type-step",
            fields: [
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
            nextStep: "build-step",
            fields: [
              ...GenericTypeItems(pickers),
              {
                component: 'plain-text',
                name: 'gt-deec',
                label: 'Most boats will only have one, but a Nobby can be a yacht too, for example',
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
                  ...basicDimensionItems,
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
                2: "descriptions-step",
              },
            },
            fields: [
              {
                name: "skip-handicap",
                title: "Do you want a handicap",
                component: 'sub-form',
                fields: [
                  {
                    component: 'radio',
                    name: "ddf.skip-handicap",
                    label: 'Get a Handicap',
                    helperText: "There are some mandatory fields in the handicap section. If you don't need a handicap right now, you can skip this part.",
                    initialValue: "1",
                    validate: [
                      {
                        type: 'required',
                      },
                    ],
                    options: [
                      {
                        label: "I want a handicap",
                        value: "1",
                      },
                      {
                        label: "I'll skip this for now",
                        value: "2",
                      },
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
            fields: descriptionsItems,
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
                    initialValue: values.user?.email || '',
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

const PhotoUpload = ({ component, name, title }) => {
  const { input } = useFieldApi({ component, name });

  const onDrop = (p) => {
    input.onChange(p);
  };

  return (
    <Photodrop onDrop={onDrop} />
  );
};

const ignoredKeys = [
  // 'design_class',
  'oga_no',
  'short_description',
  'full_description',
  'home_port',
  'home_country',
  'created_at',
  'updated_at',
  'for_sales',
  'ownerships',
  'name',
  'year',
  'year_is_approximate',
  'id',
  'selling_status',
  'previous_names',
  'image_key',
  'thumb',
  'uk_part1',
  'mmsi',
  'sail_number',
  'ssr',
  'nhsr',
  'callsign',
  'nsbr',
  'hin',
  'website',
  'reference',
];

export function flattenToForm(example, prefix) {
  let flat = {};
  Object.keys(example).forEach((key) => {
    const value = example[key];
    if (ignoredKeys.includes(key)) {
      console.log('omit', key, value);
    } else {
      const flatfield = `${prefix || ''}${(prefix && '.') || ''}${key}`;
      switch (typeof value) {
        case 'string':
          // console.log('string', flatfield);
          flat[flatfield] = value;
          break;
        case 'number':
          // console.log('number', flatfield);
          flat[flatfield] = value;
          break;
        case 'boolean':
          // console.log('boolean', flatfield, value);
          flat[flatfield] = value;
          break;
        case 'object':
          if (['designer', 'builder'].includes(key)) {
            let val;
            if (Array.isArray(value)) {
              val = value.map((m) => m?.name);
            } else {
              val = [value?.name];
            }
            if (val) {
              flat[flatfield] = val;
            }
          } else if (Array.isArray(value)) {
            value.forEach((row, index) => {
              const v = flattenToForm(value, flatfield);
              flat[flatfield] = v;
            });
          } else {
            if (value) {
              const v = flattenToForm(value, flatfield);
              // console.log('object', flatfield, v);
              flat = { ...flat, ...v };
            }
          }
          break;
        default:
          // console.log('type', key, typeof value);
          break;
      }
    }
  });
  // console.log(flat);
  return flat;
}

function initialiseFromExampleFlat(change, example) {
  const archetype = flattenToForm(boatm2f(example));
  Object.keys(archetype).forEach((field) => {
    change(field, archetype[field]);
  });
}

const FieldListener = () => {
  const { getState, change } = useFormApi();

  const { design_class, filterable } = getState().values;

  useEffect(() => {
    if (design_class) {
      const instances = filterable.filter((boat) => boat.design_class === design_class);
      const smallest = Math.min(...instances.map((boat) => boat.oga_no));
      // console.log('smallest', smallest);
      getBoatData(smallest)
        .then((result) => {
          initialiseFromExampleFlat(change, result.result.pageContext.boat);
        });
    }
  }, [change, design_class, filterable]);

  return null;
};

const FieldListenerWrapper = () => <FormSpy subcription={{ values: true }}>{() => <FieldListener />}</FormSpy>;

export function makeOwnerships({ owner, otherowners }) {
  if (owner.part) {
    const start = owner.start;
    const share = Math.floor(64 / (otherowners.length + 1));
    const o = otherowners.map((r) => ({
      name: r.name,
      start,
      share,
      current: true,
    }));
    return [{
      name: owner.name,
      start: owner.start,
      share: 64 - share * otherowners.length,
      current: true,
    }, ...o];
  }
  return [{
    name: owner.name,
    start: owner.start,
    share: 64,
    current: true,
  }];
}

export default function CreateBoatDialog({ open, onCancel, onSubmit }) {
  const { user } = useAuth0();
  const [filterable, setFilterable] = useState();
  const [pickers, setPickers] = useState();

  useEffect(() => {
    if (open && !filterable) {
      getFilterable().then((r) => setFilterable(r)).catch((e) => console.log(e));
    }
  }, [filterable]);

  useEffect(() => {
    if (open && !pickers) {
      getPicklists().then((r) => setPickers(r)).catch((e) => console.log(e));
    }
  }, [pickers]);

  const handleSubmit = (boat) => {
    if (boat.ddf.owned) {
      boat.ownerships = makeOwnerships(boat.ddf);
    }
    if (!pickers) {
      console.log('no pickers');
    }
    boat.design_class = pickers?.design_class.find((item) => item.name === boat.design_class);
    boat.designer = pickers.designer.find((item) => item.id === boat.designer);
    boat.builder = pickers.builder.find((item) => item.id === boat.builder);
    onSubmit(boat);
  }

  if (!open) return '';

  console.log('OPEN');

  return (
    <Dialog
      open={open}
      aria-labelledby="form-dialog-title"
    >
      <Box sx={{ marginLeft: '1.5rem', marginTop: '1rem' }}>
        <Typography variant="h5" >Add a boat to the Register</Typography>
      </Box>
      <FormRenderer
        componentMapper={{
          ...componentMapper,
          html: HtmlEditor,
          pic: PhotoUpload,
          'field-listener': FieldListenerWrapper,
        }}
        FormTemplate={(props) => (
          <FormTemplate {...props} showFormControls={false} />
        )}
        schema={schema(pickers)}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        initialValues={{ user, filterable }}
        subscription={{ values: true }}
      />

    </Dialog>
  );
}

export function SimpleFormDialog() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData).entries());
    const email = formJson.email;
    console.log(email);
    handleClose();
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText>
          <form onSubmit={handleSubmit} id="subscription-form">
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="email"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="subscription-form">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
