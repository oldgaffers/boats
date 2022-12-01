import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import FormSpy from '@data-driven-forms/react-form-renderer/form-spy';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import {
  FormRenderer,
  componentTypes,
  dataTypes,
  validatorTypes,
  useFieldApi
} from "@data-driven-forms/react-form-renderer";
import {
  componentMapper,
  FormTemplate,
} from "@data-driven-forms/mui-component-mapper";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import {
  mapPicker,
  designerItems,
  builderItems,
  constructionItems,
} from "./ddf/util";
import { DropzoneArea } from "react-mui-dropzone";
import { steps as handicap_steps } from "./Handicap";
import {
  yearItems,
  homeItems,
  registrationForm,
  descriptionsItems,
  yachtHullStep,
  dinghyHullStep,
} from "./ddf/SubForms";
import { HtmlEditor } from "./ddf/RTE";
import Typography from "@mui/material/Typography";
import { findFirstAbsent } from '../util/oganoutils';
import { getBoatData, useGetFilterable, useGetPicklists } from './boatregisterposts';

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
        component: componentTypes.WIZARD,
        name: "boat",
        fields: [
          {
            name: "check-step",
            nextStep: "prefill-step",
            fields: [
              {
                component: componentTypes.PLAIN_TEXT,
                name: "ddf.dc.check1",
                label: "If the boat you want to add has an OGA Number it is already on the register."
                  + " Over 3,000 boats already are."
              },
              {
                component: componentTypes.PLAIN_TEXT,
                name: "ddf.dc.check2",
                label: "You can search the register by the current or a previous name or by OGA Number."
                  + " Or you can filter by age, length, type, etc.",
              },
              {
                component: componentTypes.PLAIN_TEXT,
                name: "ddf.dc.check3",
                label: "If you can find the boat on the register, please click on the MORE button on the boat's card."
                  + " Then use the ADD PICTURES or the I HAVE EDITS buttons instead of using this form."
              },
              {
                component: componentTypes.PLAIN_TEXT,
                name: "ddf.dc.check4",
                label: " If you aren't sure, please contact the boat register editors."
              },
              {
                component: componentTypes.CHECKBOX,
                name: "ddf.dc.isnew",
                label: "I've checked and the boat isn't already on the register.",
                isRequired: true,
                validate: [{ type: validatorTypes.REQUIRED }],
              }
            ]
          },
          {
            name: "prefill-step",
            nextStep: ({ values }) => (values.ddf && values.ddf.have_pictures) ? "picture-step" : "basic-step",
            fields: [
              {
                component: componentTypes.SUB_FORM,
                name: 'ddf.dc',
                fields: [
                  {
                    component: componentTypes.PLAIN_TEXT,
                    name: "ddf.dc.desc",
                    label: " Fields marked with a * are mandatory, everything else is optional."
                      + " Once your boat has an entry you can add more pictures and information."
                      + " As a minimum, we'd like a name, picture, rig type, mainsail type, length, beam and short description."
                    ,
                  },
                  {
                    component: componentTypes.TEXT_FIELD,
                    name: "name",
                    label: "the name of the boat",
                    helperText: 'if the boat has had other names in the past they can be added later in this form',
                    type: "string",
                    dataType: dataTypes.STRING,
                    isRequired: true,
                    validate: [
                      {
                        type: validatorTypes.REQUIRED,
                      },
                    ],
                  },
                  {
                    component: componentTypes.SELECT,
                    name: 'design_class',
                    label: 'Design Class',
                    //helperText: 'If your boat is in a design class we have data for, will pre-fill the form from another boat in the class.'
                    //+' You will be able to change the values as boats do vary within a class.',
                    isReadOnly: false,
                    isSearchable: true,
                    isClearable: true,
                    noOptionsMessage: 'we don\'t have that class - you can add it as a new one below',
                    options: pickers['design_class'].map((i) => ({ label: i.name, value: i.name })),
                  },
                  {
                    component: componentTypes.TEXT_FIELD,
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
                    component: componentTypes.CHECKBOX,
                    name: 'ddf.have_pictures',
                    label: 'I have pictures to upload',
                    initialValue: true,
                    helperText: 'pictures are really important',
                  },
                ]
              }
            ]
          },
          {
            name: "picture-step",
            nextStep: "basic-step",
            fields: [
              {
                name: "ddf.picture",
                component: componentTypes.SUB_FORM,
                fields: [
                  {
                    component: componentTypes.PLAIN_TEXT,
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
                    component: componentTypes.TEXT_FIELD,
                    name: "ddf.copyright",
                    label: "copyright owner",
                    helperText: "All the pictures you add now must have the same copyright owner",
                    isRequired: true,
                    validate: [{ type: validatorTypes.REQUIRED }],
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
            title: "Basic Details",
            name: "basic-step",
            nextStep: "build-step",
            fields: [
              {
                component: componentTypes.SUB_FORM,
                name: "basic.form",
                title: "Basic Details",
                fields: [
                  {
                    component: componentTypes.SELECT,
                    name: "generic_type",
                    label: "Generic Type",
                    isReadOnly: false,
                    isSearchable: true,
                    isClearable: true,
                    initialValue: 'Yacht',
                    options: mapPicker(pickers.generic_type),
                  },
                  {
                    component: componentTypes.SELECT,
                    name: "rig_type",
                    label: "Rig",
                    isRequired: true,
                    initialValue: 'Cutter',
                    validate: [
                      {
                        type: validatorTypes.REQUIRED,
                      },
                    ],
                    options: mapPicker(pickers.rig_type),
                  },
                  {
                    component: componentTypes.SELECT,
                    name: "mainsail_type",
                    label: "Mainsail",
                    isRequired: true,
                    initialValue: 'gaff',
                    validate: [
                      {
                        type: validatorTypes.REQUIRED,
                      },
                    ],
                    options: mapPicker(pickers.sail_type),
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
                component: componentTypes.SUB_FORM,
                fields: [
                  ...yearItems,
                  {
                    component: componentTypes.TEXT_FIELD,
                    name: "place_built",
                    label: "Place Built",
                  },
                  ...builderItems(pickers),
                  {
                    component: componentTypes.TEXT_FIELD,
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
                component: componentTypes.SUB_FORM,
                fields: [
                  ...designerItems(pickers),
                  {
                    component: componentTypes.TEXT_FIELD,
                    name: "length_on_deck",
                    label: "Length on deck  (decimal feet)",
                    type: "number",
                    dataType: dataTypes.FLOAT,
                    isRequired: true,
                    validate: [
                      // {
                      // type: validatorTypes.REQUIRED,
                      // },
                      //{
                      //   type: validatorTypes.MIN_NUMBER_VALUE,
                      //   threshold: 5
                      //}
                    ],
                  },
                  {
                    component: componentTypes.TEXT_FIELD,
                    name: "handicap_data.beam",
                    label: "Beam (decimal feet)",
                    type: "number",
                    dataType: dataTypes.FLOAT,
                    isRequired: true,
                    validate: [
                      // {
                      // type: validatorTypes.REQUIRED,
                      // },
                      //{
                      //   type: validatorTypes.MIN_NUMBER_VALUE,
                      //   threshold: 1
                      // }
                    ],
                  },
                  {
                    component: componentTypes.TEXT_FIELD,
                    name: "draft",
                    label: "Draft (decimal feet)",
                    type: "number",
                    dataType: dataTypes.FLOAT,
                    validate: [
                      // {
                      //   type: validatorTypes.MIN_NUMBER_VALUE,
                      //   threshold: 1
                      //  }
                    ],
                  },
                  {
                    component: componentTypes.TEXT_FIELD,
                    name: "air_draft",
                    label: "Air Draft (decimal feet)",
                    type: "number",
                    dataType: dataTypes.FLOAT,
                    initialValue: 10,
                    validate: [
                      //{
                      //  type: validatorTypes.MIN_NUMBER_VALUE,
                      //  threshold: 1
                      //}
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
                component: componentTypes.SUB_FORM,
                fields: [
                  {
                    component: componentTypes.FIELD_ARRAY,
                    name: "reference",
                    label: "References in Gaffers Log, etc.",
                    fields: [{ component: "text-field" }],
                  },
                  {
                    component: componentTypes.PLAIN_TEXT,
                    name: "website.label",
                    label: "Website Link",
                    variant: "h6",
                  },
                  {
                    component: componentTypes.TEXT_FIELD,
                    name: "website",
                    label: "a valid website url",
                    validate: [
                      {
                        type: validatorTypes.PATTERN,
                        pattern: /^https?:\/\/[^\s/$.?#].[^\s]*$/i
                      }
                    ]
                  },
                ],
              },
            ],
          },
          {
            name: "previousnames-step",
            nextStep: "locations-step",
            fields: [
              {
                label: "Previous names",
                component: componentTypes.FIELD_ARRAY,
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
                component: componentTypes.SUB_FORM,
                fields: [
                  ...homeItems,
                ],
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
                component: componentTypes.SUB_FORM,
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
                2: "done-step",
              },
            },
            fields: [
              {
                name: "skip-handicap",
                title: "Do you want a handicap",
                description: "There are some mandatory fields in the handicap section. If you don't need a handicap right now, you can skip this part.",
                component: componentTypes.SUB_FORM,
                fields: [
                  {
                    component: componentTypes.RADIO,
                    name: "ddf.skip-handicap",
                    initialValue: "1",
                    validate: [
                      {
                        type: validatorTypes.REQUIRED,
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
          ...handicap_steps('done-step'),
          {
            name: "done-step",
            component: componentTypes.SUB_FORM,
            fields: [
              ...descriptionsItems,
              {
                component: componentTypes.PLAIN_TEXT,
                name: "ddf.we_are_done",
                label:
                  "Thanks for helping make the register better. The editor's will review your suggestions. An email address will let us discuss with you any queries we might have.",
              },
              {
                component: componentTypes.TEXT_FIELD,
                name: "email",
                label: "email",
                isRequired: true,
                validate: [
                  { type: validatorTypes.REQUIRED },
                  {
                    type: validatorTypes.PATTERN,
                    pattern: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
                  }
                ],
                resolveProps: (props, { meta, input }, formOptions) => {
                  const { values } = formOptions.getState();
                  return {
                    initialValue: values.user && values.user.email,
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
    <DropzoneArea
      maxFileSize={5242880}
      acceptedFiles={["image/*"]}
      onChange={onDrop}
    />
  );
};

const ignoredKeys = [
  'design_class',
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
  'mssi',
  'sail_number',
  'ssr',
  'nhsr',
  'callsign',
  'nsbr',
  'website',
  'reference',
];

function flattenToForm(example, prefix) {
  let flat = {};
  Object.keys(example).forEach((key) => {
    if (ignoredKeys.includes(key)) {
      // console.log('omit', key);
    } else {
      const value = example[key];
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
            flat[flatfield] = value.id;
            // console.log('id/name', flatfield, value);
          } else if (Array.isArray(value)) {
            console.log('array', flatfield, value);
            value.forEach((row, index) => {
              const v = flattenToForm(value, flatfield);
              // console.log('array', index, v);
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
          console.log('type', key, typeof value);
          break;
      }
    }
  });
  // console.log(flat);
  return flat;
}

function initialiseFromExamplesFlat(change, examples) {
  let archetype = {};
  examples.forEach((result) => {
    const { boat } = result.value.data.result.pageContext;
    const flat = flattenToForm(boat);
    archetype = { ...archetype, ...flat };
  });
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
      const firstThree = instances.slice(0, 3).map((boat) => boat.oga_no);
      Promise.allSettled(firstThree.map((ogaNo) => getBoatData(ogaNo)))
        .then((results) => {
          initialiseFromExamplesFlat(change, results);
        });
    }
  }, [change, design_class, filterable]);

  return null;
};

const FieldListenerWrapper = () => <FormSpy subcription={{ values: true }}>{() => <FieldListener />}</FormSpy>;

export default function CreateBoatDialog({ open, onCancel, onSubmit }) {
  const { user } = useAuth0();
  const pickerLoad = useGetPicklists();
  const filterableLoad = useGetFilterable();

  if (pickerLoad.loading || filterableLoad.loading) return <p>Loading...</p>
  if (pickerLoad.error || filterableLoad.error) {
    return (<div>
      Sorry, we had a problem getting the data to populate the form dropdowns
    </div>);
  }

  if (!open) return '';

  const filterable = filterableLoad.data;
  const pickers = pickerLoad.data;

  const handleSubmit = (boat) => {
    // console.log('handleSubmit', boat);
    const ogaNo = findFirstAbsent(filterable);
    boat.oga_no = ogaNo;
    // boat.design_class = pickers.design_class.find((item) => item.id === boat.design_class);
    boat.designer = pickers.designer.find((item) => item.id === boat.designer);
    boat.builder = pickers.builder.find((item) => item.id === boat.builder);
    onSubmit(boat);
  }
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
