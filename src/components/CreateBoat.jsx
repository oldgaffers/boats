import React, { useState } from "react";
import FormRenderer, {
  componentTypes,
  dataTypes,
  validatorTypes,
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
  designerItems,
  builderItems,
  designClassItems,
  constructionItems,
} from "./ddf/util";
import { theme, HtmlEditor } from "./ddf/RTE";
import { DropzoneArea } from "material-ui-dropzone";
import { mapPicker } from "./Rig";
import { steps as handicap_steps } from "./Handicap";
import {
  yearItems,
  homeItems,
  RegistrationForm,
  descriptionsItems,
  yachtHullStep,
  dinghyHullStep,
} from "./ddf/SubForms";

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

const schema = (pickers) => {
  return {
    fields: [
      {
        title: "New Boat Record",
        component: componentTypes.WIZARD,
        name: "boat",
        fields: [
          {
            title: "Name and description",
            name: "step-1",
            nextStep: {
              when: "ddf.design",
              stepMapper: {
                1: "picture-step",
                2: "production-boat-step",
                3: "similar-boat-step",
              },
            },
            fields: [
              {
                title: "Name",
                name: "name",
                component: componentTypes.SUB_FORM,
                fields: [
                  {
                    component: componentTypes.TEXT_FIELD,
                    name: "name",
                    label: "Boat Name",
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
                    component: componentTypes.RADIO,
                    label: "This boat is a",
                    name: "ddf.design",
                    initialValue: "1",
                    options: [
                      {
                        label: "One-off",
                        value: "1",
                      },
                      {
                        label: "Production design",
                        value: "2",
                      },
                      {
                        label: "Similar to another boat on the register",
                        value: "3",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: "production-boat-step",
            nextStep: "picture-step",
            fields: [
              {
                title: "Production Boat Design Class",
                component: componentTypes.SUB_FORM,
                name: 'ddf.prod',
                fields: [...designClassItems(pickers)],    
              }
            ]
          },
          {
            name: "similar-boat-step",
            nextStep: "picture-step",
            fields: [
              {
                title: "Production Boat Design Class",
                component: componentTypes.SUB_FORM,
                name: 'ddf.similar',
                fields: [
                  {
                    component: componentTypes.TEXT_FIELD,
                    name: "ddf.like",
                    label: "OGA No. of existing boat",
                    type: "number",
                    dataType: dataTypes.INTEGER,    
                    resolveProps: (props, { meta, input }, formOptions) => {
                      const { values } = formOptions.getState();
                      console.log('like', input);
                      console.log('like', values);
                    },
                  }
                ],    
              }
            ]
          },
          {
            name: "picture-step",
            nextStep: "basic-step",
            fields: [
              {
                title: "I have a digital photo of this boat",
                name: "ddf.picture.form",
                component: componentTypes.SUB_FORM,
                fields: [
                  {
                    component: componentTypes.PLAIN_TEXT,
                    name: "ddf.picture.desc",
                    label:
                      "If you have more than one picture upload the best one(s) here, ideally of her sailing. All pictures uploaded at one time should have the same copyright owner. You will be able to add more pictures later from the boat's detail page.",
                  },
                  {
                    component: "pic",
                    name: "picture.pic",
                    label: "everything",
                  },
                  {
                    component: componentTypes.TEXT_FIELD,
                    name: "picture.copyright",
                    label: "copyright owner",
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
                    name: "place",
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
                    name: "lod",
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
                    label: "Draft",
                    type: "number",
                    dataType: dataTypes.INTEGER,
                  },
                  {
                    component: componentTypes.TEXT_FIELD,
                    name: "air_draft",
                    label: "Air Draft",
                    type: "number",
                    dataType: dataTypes.INTEGER,
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
                    label: "Website URL",
                    variant: "h6",
                  },
                  {
                    component: componentTypes.TEXT_FIELD,
                    name: "website",
                    label: "website url",
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
                  {
                    component: componentTypes.TEXT_FIELD,
                    name: "place_built",
                    label: "Place built",
                  },
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
              values.generic_type === "Dinghy"
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
              },
            ],
          },
        ],
      },
    ],
  };
};

const CreateBoatDialog = ({ classes, open, onCancel, onSubmit }) => {
  const { loading, error, data } = usePicklists();

  if (loading) return <CircularProgress />;
  if (error) return <p>Error :(can't get picklists)</p>;

  const pickers = data;

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
              pic: DropzoneArea,
            }}
            FormTemplate={(props) => (
              <FormTemplate {...props} showFormControls={false} />
            )}
            schema={schema(pickers)}
            onSubmit={onSubmit}
            onCancel={onCancel}
            initialValues={{ short_description: "A fine example of her type." }}
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
    console.log("cancel");
    setOpen(false);
  };

  const handleSend = () => {
    console.log("send");
    setOpen(false);
    setSnackBarOpen(true);
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
      >
        form
      </Button>
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
