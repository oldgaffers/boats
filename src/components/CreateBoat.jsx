import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import FormRenderer, {
  componentTypes,
  dataTypes,
  validatorTypes,
  useFieldApi
} from "@data-driven-forms/react-form-renderer";
import {
  componentMapper,
  FormTemplate,
} from "@data-driven-forms/mui-component-mapper";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import { usePicklists } from "../util/picklists";
import {
  mapPicker,
  designerItems,
  builderItems,
  constructionItems,
} from "./ddf/util";
import { theme, HtmlEditor } from "./ddf/RTE";
import { DropzoneArea } from "material-ui-dropzone";
import { steps as handicap_steps } from "./Handicap";
import {
  yearItems,
  homeItems,
  RegistrationForm,
  descriptionsItems,
  yachtHullStep,
  dinghyHullStep,
} from "./ddf/SubForms";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { boatm2f, boatf2m } from "../util/format";

const useStyles = makeStyles((theme) => ({
  editor: {
    minwidth: 500,
    minHeight: 500,
    margin: 10,
    padding: 10,
    border: "none",
    boxShadow: "none",
  },
  grid: {
    margin: "10px",
    width: "auto",
  },
  dialog: {
    maxWidth: "max-content",
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(0),
    marginLeft: theme.spacing(0),
  },
}));

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
current_owners	jsonb
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
            name: "prefill-step",
            nextStep: "name-and-picture-step",
            fields: [
              {
                title: "Welcome to the new boat form",
                component: componentTypes.SUB_FORM,
                name: 'ddf.dc',
                fields: [
                  {
                    component: componentTypes.PLAIN_TEXT,
                    name: "ddf.dc.desc",
                    label:
                      " If your boat is in a design class we will pre-fill the form from another boat in the class."
                      // +" On each page enter the data and then continue to the next page."
                      // +" On the last page we'll ask you for an email address so we can discuss any queries we have."
                      +" Only fields marked with a * are mandatory."
                      +" Once your boat has an entry you can add more pictures and information."
                      +" As a minimum, we'd like a name, picture, rig type, mainsail type, length, beam and short description."
                      ,
                  },
                  {
                    component: componentTypes.RADIO,
                    label: "This boat is a",
                    name: "ddf.design",
                    initialValue: "1",
                    options: [
                      {
                        label: "Production design",
                        value: "1",
                      },
                      {
                        label: "One-off",
                        value: "2",
                      },
                    ],
                    resolveProps: (props, { meta, input }, formOptions) => {
                      if(input.value === "2") {
                        onChooseDesignClass(undefined);
                      }
                    },
                  },
                  {
                    component: componentTypes.SELECT,
                    condition: {
                      when: 'ddf.design',
                      is: "1",
                    },
                    name: 'design_class',
                    label: 'Design Class',
                    isReadOnly: false,
                    isSearchable: true,
                    isClearable: true,
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
                    condition: {
                      and: [
                        { when: 'ddf.design', is: "1" },
                        { when: 'design_class', isEmpty: true }
                      ]
                    },
                    name: 'new_design_class',
                    label: 'if the design class is not listed and you know the name add it here',
                    isRequired: false,
                  },                  
                ]  
              }
            ]
          },
          {
            name: "name-and-picture-step",
            nextStep: "basic-step",
            fields: [
              {
                title: 'Name and picture',
                name: "ddf.name-picture",
                component: componentTypes.SUB_FORM,
                fields: [
                  {
                    component: componentTypes.PLAIN_TEXT,
                    name: "ddf.boat_name",
                    label: " The Name of the boat",
                    variant: "h6",
                  },
                  {
                    component: componentTypes.TEXT_FIELD,
                    name: "name",
                    label: "the current name",
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
                    component: componentTypes.PLAIN_TEXT,
                    name: "ddf.pics",
                    label: "Pictures",
                    variant: "h6",
                  },
                  {
                    component: componentTypes.PLAIN_TEXT,
                    name: "ddf.picture.desc",
                    label:
                      "Please add a picture. If you have more than one picture upload the best one(s) here, ideally of her sailing. All pictures uploaded at one time should have the same copyright owner. You will be able to add more pictures later from the boat's detail page.",
                  },
                  {
                    component: "pic",
                    name: "ddf.fileList",
                  },
                  {
                    component: componentTypes.TEXT_FIELD,
                    name: "ddf.copyright",
                    label: "copyright owner",
                    resolveProps: (props, { meta, input }, formOptions) => {
                      const { values } = formOptions.getState();
                      const isRequired = values.ddf.fileList && values.ddf.fileList.length>0;
                      let initialValue = values.user && values.user.name;
                      console.log('isRequired', isRequired);
                      const validate = [];
                      if (isRequired) {
                        validate.push({ type: validatorTypes.REQUIRED });
                        initialValue = initialValue || '';
                      }
                      const r = {
                        initialValue,
                        isRequired,
                        validate,                          
                      };
                      console.log('copyright', JSON.stringify(r));
                      return r;
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
            fields: [RegistrationForm],
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

const CreateBoatDialog = ({ classes, open, onCancel, onSubmit }) => {
  const [dc, setDc] = useState('00000000-0000-0000-0000-000000000000');
  const pl = usePicklists();
  const bt = useQuery( query, { variables: { dc: dc  } } ); 
  const { user } = useAuth0();

  if (pl.loading || bt.loading) return <CircularProgress />;
  if (pl.error) return <p>Error :(can't get picklists)</p>;

  const pickers = pl.data;
  const boat = bt.data.design_class.length>0?bt.data.design_class[0].boatByArchetype:{};
  boat.short_description = "She is a fine example of her type.";

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
      className={classes.dialog}
      aria-labelledby="form-dialog-title"
    >
      <Grid spacing={4} container className={classes.grid}>
        <MuiThemeProvider theme={theme}>
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
        </MuiThemeProvider>
      </Grid>
    </Dialog>
  );
};

function CreateBoatButton() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSend = (values) => {
    const { user, email, ddf, ...b } = values;
    const { new_design_class, new_designer, new_builder, ...boat} = b;
    const { fileList, copyright } = ddf;
    setOpen(false);
    const formData = new FormData();
    if (fileList && fileList.length>0) {
      for(let i=0; i<fileList.length; i++) {
        formData.set(`file[${i}]`, fileList[i]);
      }
    }
    const create = {};
    if(new_design_class) {
      create.design_class = new_design_class;
    }
    if(new_designer) {
      create.designer = new_designer;
    }
    if(new_builder) {
      create.builder = new_builder;
    }
    formData.set("boat", JSON.stringify(boatf2m(boat)));
    formData.set("create", JSON.stringify(create));
    formData.set("copyright", copyright);
    formData.set("email", email);
    formData.set("uuid", uuidv4());
    axios.post(
      'https://ac861c76e041d1b288fba6a2f1d52bdb.m.pipedream.net',
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          pipedream_upload_body: 1,
        },
      },
    ).then(response => {
      setSnackBarOpen(true);
    }).catch(error => {
      console.log('post', error);
      // TODO snackbar from response.data
    });      
  };

  const snackBarClose = () => {
    setSnackBarOpen(false);
  };

  return (
    <>
      <Button
        className={classes.button}
        size="small"
        color="secondary"
        onClick={() => setOpen(true)}
      >form</Button>
      <CreateBoatDialog
        classes={classes}
        open={open}
        onCancel={handleCancel}
        onSubmit={handleSend}
      />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snackBarOpen}
        autoHideDuration={2000}
        onClose={snackBarClose}
        message="Thanks, we'll get back to you."
        severity="success"
      />
    </>
  );
}

export default CreateBoatButton;
