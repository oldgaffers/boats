import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
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
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import { useLazyPicklists } from "../util/picklists";
import {
  mapPicker,
  designerItems,
  builderItems,
  constructionItems,
} from "./ddf/util";
import { DropzoneArea } from "material-ui-dropzone";
import { steps as handicap_steps } from "./Handicap";
import {
  yearItems,
  homeItems,
  registrationForm,
  descriptionsItems,
  yachtHullStep,
  dinghyHullStep,
} from "./ddf/SubForms";
import { gql, useLazyQuery } from '@apollo/client';
import { boatm2f } from "../util/format";
import { HtmlEditor } from "./ddf/RTE";
import { Typography } from "@mui/material";

/* 
✅ name	text
✅ mainsail_type	text
✅ rig_type	text
✅ short_description	text
✅ full_description	text
✅ website	text
✅ hull_form	text
✅ year	integer
✅ year_is_approximate	boolean
✅ draft	numeric
✅ beam	numeric
✅ length_on_deck	numeric
✅ construction_method	text
✅ construction_material	text
✅ construction_details	text
✅ spar_material	text
✅ air_draft	numeric
✅ mssi	text
✅ uk_part1	text
✅ ssr	text
✅ nsbr	text
✅ nhsr	text
✅ callsign	text
✅ sail_number	text
✅ fishing_number	text
✅ place_built	text
✅ hin	text
✅ builder	uuid
✅ designer	uuid
✅ generic_type	text
✅ design_class	uuid
✅ image_key	text
✅ previous_names	jsonb
✅ handicap_data	jsonb
✅ thumb	text
✅ reference	jsonb
✅ home_port	text
✅ home_country	text
price	numeric
selling_status	text
ownerships	jsonb
oga_no	integer
keel_laid	date
launched	date
current_location	point
id	uuid
created_at	timestamp with time zone
updated_at	timestamp with time zone
*/

/*
 other fields we might get:
      builderByBuilder { name }
      construction_details
      designClassByDesignClass { name }
      designerByDesigner { name }
 */
const query = gql`query dc($dc: uuid = "") {
  design_class(where: {id: {_eq: $dc}}) {
    boatByArchetype {
      air_draft
      beam
      builder
      construction_material
      construction_method
      design_class
      designer
      draft
      generic_type
      handicap_data
      hull_form
      length_on_deck
      mainsail_type
      place_built
      rig_type
      sail_type { name }
      spar_material
    }
  }
}`;

const schema = (pickers, onChooseDesignClass) => {
  return {
    fields: [
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
                  +" Over 3,000 boats already are."
              },
              {
                component: componentTypes.PLAIN_TEXT,
                name: "ddf.dc.check2",
                label: "You can search the register by the current or a previous name or by OGA Number."
                  +" Or you can filter by age, length, type, etc.",
              },
              {
                component: componentTypes.PLAIN_TEXT,
                name: "ddf.dc.check3",
                label: "If you can find the boat on the register, please click on the MORE button on the boat's card."
                  +" Then use the ADD PICTURES or the I HAVE EDITS buttons instead of using this form."
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
                validate: [{type: validatorTypes.REQUIRED}],
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
                      +" Once your boat has an entry you can add more pictures and information."
                      +" As a minimum, we'd like a name, picture, rig type, mainsail type, length, beam and short description."
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
                    helperText: 'If your boat is in a design class we have data for, will pre-fill the form from another boat in the class.'
                    +' You will be able to change the values as boats do vary within a class.',
                    isReadOnly: false,
                    isSearchable: true,
                    isClearable: true,
                    noOptionsMessage: 'we dont\' have that class - you can add it as a new one below',
                    options: mapPicker(pickers['design_class']),
                    resolveProps: (props, { meta, input }, formOptions) => {
                      const state = formOptions.getState();
                      if (state.dirty) {
                        onChooseDesignClass(input.value);
                      }
                    },
                  },
                  {
                    component: componentTypes.TEXT_FIELD,
                    name: 'new_design_class',
                    label: 'New design class',
                    helperText: 'if the design class is not listed and you know the name add it here',
                    isRequired: false,
                    resolveProps: (props, { meta, input }, formOptions) => {
                      const designClass = formOptions.getFieldState('design_class');
                      if (designClass && designClass.value) {
                        return { isReadOnly: true };
                      }
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
                      +" If you have more than one picture upload the best one(s) here."
                      +" You will be able to add more pictures later from the boat's detail page.",
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
                    options: mapPicker(pickers.generic_type),
                  },
                  {
                    component: componentTypes.SELECT,
                    name: "rig_type",
                    label: "Rig",
                    isRequired: true,
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
                      {
                        type: validatorTypes.REQUIRED,
                      },
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
                      {
                        type: validatorTypes.REQUIRED,
                      },
                    ],
                  },
                  {
                    component: componentTypes.TEXT_FIELD,
                    name: "draft",
                    label: "Draft (decimal feet)",
                    type: "number",
                    dataType: dataTypes.FLOAT,
                  },
                  {
                    component: componentTypes.TEXT_FIELD,
                    name: "air_draft",
                    label: "Air Draft (decimal feet)",
                    type: "number",
                    dataType: dataTypes.FLOAT,
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
          ...handicap_steps,
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
  const { input } = useFieldApi({component, name});

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

export default function CreateBoatDialog({ open, onCancel, onSubmit }) {
  const [dc, setDc] = useState('00000000-0000-0000-0000-000000000000');
  const [getPickLists, pl] = useLazyPicklists();
  const [getBoat, bt] = useLazyQuery( query, { variables: { dc } } ); 
  const { user } = useAuth0();

  if (!open) return '';
  if (pl.loading || bt.loading) return <CircularProgress />;
  if (pl.error) return <p>Error :(can't get picklists)</p>;
  if (!pl.data) {
    getPickLists();
    return <CircularProgress />;
  }
  if (!bt.data) {
    getBoat();
    return <CircularProgress />;
  }
  const pickers = pl.data;
  let boat = { short_description: 'She\'s a real one-off.' };
  if (bt.data.design_class.length>0) {
    const archetype = bt.data.design_class[0].boatByArchetype
    boat =  { ...archetype, short_description: "She is a fine example of her type." };
  }

  const onChooseDesignClass = (id) => {
    if (id) {
      setDc(id);
    } else {
      setDc('00000000-0000-0000-0000-000000000000');
    }
  };

  return (
    <Dialog
      open={open}
      aria-labelledby="form-dialog-title"
    >
      <Box sx={{marginLeft: '1.5rem', marginTop: '1rem'}}>
      <Typography variant="h5" >Add a boat to the Register</Typography>
      </Box>
        <FormRenderer
          componentMapper={{
            ...componentMapper,
            html: HtmlEditor,
            pic: PhotoUpload,
          }}
          FormTemplate={(props) => (
            <FormTemplate {...props} showFormControls={false} />
          )}
          schema={schema(pickers, onChooseDesignClass)}
          onSubmit={onSubmit}
          onCancel={onCancel}
          initialValues={{ ...boatm2f(boat), user }}
          subscription={{ values: true }}
          />
          
    </Dialog>
  );
}
