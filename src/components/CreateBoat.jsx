import React, { useState } from 'react';
import FormRenderer, {
  componentTypes, dataTypes, validatorTypes,
} from "@data-driven-forms/react-form-renderer";
import {
  componentMapper,
  FormTemplate,
} from "@data-driven-forms/mui-component-mapper";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';
import { usePicklists } from "../util/picklists";
import { designerItems, builderItems, designClassItems, constructionItems } from "./ddf/util";
import { theme, HtmlEditor } from "./ddf/RTE";
import { DropzoneArea } from "material-ui-dropzone";
import { mapPicker } from "./Rig";
import { steps as handicap_steps } from "./Handicap";
import { 
  yearItems, homeItems, RegistrationForm, descriptionsItems,
  yachtHullStep, dinghyHullStep } from "./ddf/SubForms";

const useStyles = makeStyles((theme) => ({
  editor: {
    minwidth: 500,
    minHeight: 500,
    margin: 10,
    padding: 10,
    border: 'none',
    boxShadow: 'none'
  },
  grid: {
    margin: '10px',
    width: 'auto'
  },
  dialog: {
    maxWidth: 'max-content',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
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
  "fields": [
    {
      title: "New Boat Record",
      "component": componentTypes.WIZARD,
      "name": "boat",
      "fields": [
        {
          "title": "Name and description",
          "name": "step-1",
          "nextStep": {
            "when": "design",
            "stepMapper": {
              "1": "picture-step",
              "2": "production",
              "3":  "sister-ship"
            }
          },
          "fields": [
            {
              component: componentTypes.TEXT_FIELD,
              name: "name",
              label: "Boat Name",
              type: 'string',
              dataType: dataTypes.STRING,
              isRequired: true,
              validate: [
                {
                  type: validatorTypes.REQUIRED
                }
              ]
            },
            {
              component: componentTypes.RADIO,
              isRequired: true,
              label: "This boat is a",
              name: "design",
              initialValue: "1",
              options: [
                {
                  "label": "One-off",
                  "value": "1"
                },
                {
                  "label": "Production design",
                  "value": "2"
                },
                {
                  "label": "Sister-ship to a boat on the register",
                  "value": "3"
                }
              ]
            }
          ]
        },
        {
          "name": "production",
          "title": "Production Boat Details",
          "fields": [
            ...designClassItems(pickers),
          ]
        },
        {
          "name": "sister-ship",
          "title": "Sister-ship details",
          "fields": [
            {
              component: componentTypes.TEXT_FIELD,
              name: "like",
              label: "OGA No. of existing boat",
              type: 'number',
              dataType: dataTypes.INTEGER,
            },
          ]
        },
      {
          "title": "I have a digital photo of this boat",
          "name": "picture-step",
          nextStep: 'basic',
          component: componentTypes.SUB_FORM,
          "fields": [
            {
              "component": componentTypes.PLAIN_TEXT,
              "name": "picture.desc",
              "label": "If you have more than one picture upload the best one here, ideally of her sailing. Email the other pictures to the editors. Please let us know who owns the copyright for each picture."
            },
            {
              "component": "pic",
              "name": "picture.pic",
              "label": "everything"
            },
            {
              "component": componentTypes.TEXT_FIELD,
              "name": "picture.copyright",
              "label": "copyright owner"
            }
          ]
        }, 
        {
          "title": "Basic Details",
          "name": "basic",
          nextStep: 'build',
          component: componentTypes.SUB_FORM,
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
              options: mapPicker(pickers.rig_type),
            },
            {
              component: componentTypes.SELECT,
              name: "mainsail_type",
              label: "Mainsail",
              isRequired: true,
              options: mapPicker(pickers.sail_type),
            },       
          ]
        },     
        {
          "title": "Build Details",
          "name": "build",
          nextStep: 'design',
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
          ]
        },     
        {
          "title": "Design Details",
          "name": "design",
          nextStep: 'references-step',
          component: componentTypes.SUB_FORM,
          fields: [
            ...designerItems(pickers),
            {
              component: componentTypes.TEXT_FIELD,
              name: "lod",
              label: "Length on deck",
              type: 'number',
              dataType: dataTypes.INTEGER,
            },
            {
              component: componentTypes.TEXT_FIELD,
              name: "draft",
              label: "Draft",
              type: 'number',
              dataType: dataTypes.INTEGER,
            },
            {
              component: componentTypes.TEXT_FIELD,
              name: "air_draft",
              label: "Air Draft",
              type: 'number',
              dataType: dataTypes.INTEGER,
            },
          ]
        },
        {
          name: "references-step",
          nextStep: "locations-step",
          component: componentTypes.SUB_FORM,
          fields: [
            {
              component: componentTypes.TEXT_FIELD,
              name: "website",
              label: "website url",
            },
            {
              component: componentTypes.FIELD_ARRAY,
              name: "reference",
              label: "References in Gaffers Log, etc.",
              fields: [{ component: "text-field" }],
            },
          ],
        },
        {
          name: "locations-step",
          nextStep: "registrations-step",
          component: componentTypes.SUB_FORM,
          fields: [{
            title: "Previous Names and Location",
            name: "locations",
            component: componentTypes.SUB_FORM,
            fields: [
              {
                component: componentTypes.FIELD_ARRAY,
                name: "previous_names",
                label: "Previous name/s",
                fields: [{ component: "text-field" }],
              },
              {
                component: componentTypes.TEXT_FIELD,
                name: "place_built",
                label: "Place built",
              },
              ...homeItems,
            ],
          }],
        },
        {
          name: "registrations-step",
          nextStep: "construction-step",
          component: componentTypes.SUB_FORM,
          fields: [RegistrationForm],
        },
        {
          name: "construction-step",
          nextStep: ({ values }) => (values.generic_type === 'Dinghy') ? 'dinghy-hull-step' : 'yacht-hull-step',
          component: componentTypes.SUB_FORM,
          fields: [...constructionItems(pickers)],
        },
        yachtHullStep("handicap-step"),
        dinghyHullStep("handicap-step"),
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
      ]
    }
  ]
  }
};

const CreateBoatDialog = ({ classes, open, onCancel, onSubmit }) => {
  const { loading, error, data } = usePicklists();

  if (loading) return <CircularProgress />;
  if (error) return <p>Error :(can't get picklists)</p>;

  const pickers = data;
  
return (
  <Dialog open={open} className={classes.dialog} aria-labelledby="form-dialog-title">
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
      initialValues={ {short_description: 'A fine example of her type.'} }
    />
    </MuiThemeProvider>
  </Grid>
  </Dialog>
);
}

function CreateBoatButton() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const handleCancel = () => {
    console.log('cancel');
    setOpen(false);    
  }

  const handleSend = () => {
    console.log('send');
    setOpen(false);    
    setSnackBarOpen(true);
  }

  const snackBarClose = () => {
    setSnackBarOpen(false);
  }

  return (
    <>
      <Button className={classes.button} size="small"
        color="secondary" onClick={() => setOpen(true)}>
        form
      </Button>
      <CreateBoatDialog
        classes={classes}
        open={open}
        onCancel={handleCancel}
        onSubmit={handleSend}
      />
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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
