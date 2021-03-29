import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import FormRenderer, {
  componentTypes, dataTypes,
} from "@data-driven-forms/react-form-renderer";
import {
  componentMapper,
  FormTemplate,
} from "@data-driven-forms/mui-component-mapper";
import { MuiThemeProvider } from "@material-ui/core/styles";
import HullForm from "./HullForm";
import { mapPicker } from "./Rig";
import { usePicklists } from "../util/picklists";
import { theme, HtmlEditor } from "./ddf/RTE";
import { designerItems, builderItems } from "./ddf/util";

const form = (pickers) => {
  return {
    title: "New Boat",
    name: "boat",
    component: componentTypes.SUB_FORM,
    fields: [
        {
            component: componentTypes.TEXT_FIELD,
            name: "name",
            label: "Name",
            type: 'string',
            dataType: dataTypes.STRING,
        },
        {
        component: "html",
        title: "Short description",
        name: "short_description",
        controls: ["bold", "italic"],
        maxLength: 500,
      },
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
      {
        component: componentTypes.TEXT_FIELD,
        name: "year",
        label: "Year Built",
        type: 'number',
        dataType: dataTypes.INTEGER,
      },
      {
        component: componentTypes.CHECKBOX,
        name: "year_is_approximate",
        label: "Approximate",
        dataType: "boolean",
      },      
      ...designerItems(pickers),
      ...builderItems(pickers),
      {
        component: componentTypes.TEXT_FIELD,
        name: "place_built",
        label: "Place built",
      },
    ],
  };
};

function CreateBoat({classes, onCancel, onSave }) {
  const { loading, error, data } = usePicklists();

  if (loading) return <CircularProgress />;
  if (error) return <p>Error :(can't get picklists)</p>;

  const pickers = data;

  const handleSubmit = (values) => {
    console.log("submit");
    const { email, ddf, ...result } = values;
    console.log(ddf);
    onSave( result, email);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <FormRenderer
        schema={form(pickers)}
        componentMapper={{
          ...componentMapper,
          "hull-form": HullForm,
          html: HtmlEditor,
        }}
        FormTemplate={(props) => (
          <FormTemplate {...props} showFormControls={false} />
        )}
        onCancel={onCancel}
        onSubmit={handleSubmit}
      />
    </MuiThemeProvider>
  );
}

const useStyles = makeStyles((theme) => ({
    appBar: {
      position: 'relative',
    },
    layout: {
      width: 'auto',
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
        width: 600,
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    },
    paper: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
      padding: theme.spacing(2),
      [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(6),
        padding: theme.spacing(3),
      },
    },
    editor: {
      minwidth: 500,
      minHeight: 500,
      margin: 10,
      padding: 10,
      border: 'none',
      boxShadow: 'none'
    },
    stepper: {
      padding: theme.spacing(3, 0, 5),
    },
    buttons: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    button: {
      marginTop: theme.spacing(3),
      marginLeft: theme.spacing(1),
    },
  }));
  
  export default function UpdateBoatDialog({ boat, onClose, open }) {
    const classes = useStyles();
  
    const handleCancel = () => {
      onClose();
    }
  
    const handleSave = (changes) => { 
      console.log(changes);   
      onClose(changes);
    };
  
    return (
      <Dialog aria-labelledby="updateboat-dialog-title" open={open}>
        <CreateBoat classes={classes} onCancel={handleCancel} onSave={handleSave} />
      </Dialog>
    );
  }
