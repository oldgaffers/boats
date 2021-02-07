import React, { useState } from 'react';
import FormRenderer, { useFieldApi, componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import { componentMapper, FormTemplate } from "@data-driven-forms/mui-component-mapper";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import get from 'lodash/get';
//import submitFunction from './upload-handler';
import { theme } from "./ddf/RTE";

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: 'none',
  },
}));

const fileSizeValidator = ({ maxSize }) => {
  return (value) => {
    if (value && value.inputFiles[0] && value.inputFiles[0].size > maxSize) {
      /**
       * Human readable message should be generated!
       */
      return `File is too large, maximum allowed size is ${maxSize} bytes. Current file has ${value.inputFiles[0].size} bytes`;
    }
  };
};

//      <!--input id={input.name} {...input} /-->

const FileUploadComponent = (props) => {
  const { input, meta, label } = useFieldApi(props);
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <input className={classes.input} id={input.name} {...input} />
      <label htmlFor={input.name}>
        <Button variant="contained" color="primary" component="span">
        {label}
        </Button>
      </label>
      {meta.error && (
        <div>
          <span style={{ color: 'red' }}>{meta.error}</span>
        </div>
      )}
    </div>
  );
};

const schema = {
  fields: [
    {
      component: componentTypes.TEXT_FIELD,
      label: 'name',
      isReadOnly: true,
      name: 'name'
    },
    {
      component: componentTypes.TEXT_FIELD,
      label: 'OGA No.',
      isReadOnly: true,
      name: 'oga_no'
    },
    {
      component: componentTypes.TEXT_FIELD,
      label: 'Album',
      isReadOnly: true,
      name: 'albumKey'
    },
    {
      component: componentTypes.TEXT_FIELD,
      label: 'email',
      name: 'email'
    },
    {
      component: componentTypes.TEXT_FIELD,
      label: 'copyright holder',
      name: 'copyright'
    },
    {
      component: 'file-upload',
      label: 'File upload',
      name: 'file-upload-field-name',
      type: 'file',
      validate: [{ type: validatorTypes.REQUIRED }, { type: 'file-size', maxSize: 10000000 }]
    }
  ]
};

const validatorMapper = {
  'file-size': fileSizeValidator
}; 

const FormWithFileUpload = ({onCancel, onSave, boat}) => {
  const [values, setValues] = useState();
  return (
    <MuiThemeProvider theme={theme}>
      {values && (
        <div>
          <h1>See that the files gets destroyed in JSON</h1>
          <h2>See console for the stored value</h2>
          <pre>{JSON.stringify(values, null, 2)}</pre>
        </div>
      )}
      <FormRenderer
        schema={schema}
        initialValues={{name: boat.name, oga_no: boat.oga_no, albumKey: boat.image_key}}
        componentMapper={{
          ...componentMapper,
          'file-upload': FileUploadComponent,
        }}
        FormTemplate={FormTemplate}
        validatorMapper={validatorMapper}
        onCancel={onCancel}
        onSubmit={async (values, formApi) => {
          setValues(values);
          const myFile = get(values, formApi.fileInputs[0]); // there can be multiple inputs of this type
          const fileList = myFile.inputFiles; // list of file renferences that should be uploaded to somewhere
          onSave(values, fileList);
        }}
      />
    </MuiThemeProvider>
  );
};

export default FormWithFileUpload;