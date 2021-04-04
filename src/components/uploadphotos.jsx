import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ImageUploader from 'react-images-upload';


const ImageForm = props => {
  return <ImageUploader
    withIcon={false}
    label='Max file size 5MB. Submit separate forms for each copyright holder. Select multiple files at once to upload all at once.'
    buttonText='upload photos'
    onChange={props.onChange}
    imgExtension={['.jpg', '.jpeg', '.png']}
    maxFileSize={5242880}
    withPreview={true}
    singleImage={false}
  />
}

const FormWithFileUpload = ({classes, onCancel, onSave, boat}) => {
  const [pictures, setPictures] = useState([]);
  const [email, setEmail] = useState(undefined);
  const [copyright, setCopyright] = useState(undefined);

  const onDrop = (p) => {
    setPictures(p);
  }

  const onUpload = () => {
    onSave({ 
      name: boat.name, albumKey: boat.image_key, oga_no: boat.oga_no,
      copyright, email 
    }, pictures);
  }

  const ready = () => {
    if(pictures.length===0) return false;
    if(!email) return false;
    if(!copyright) return false;
    return true;
  }

  const onEmail = (e) => {
    setEmail(e.target.value);
  }

  const onCopyright = (e) => {
    setCopyright(e.target.value);
  }

  return <div>
    <Typography variant="h5">Upload pictures for {boat.name}({boat.oga_no})</Typography>
    <TextField required={true} type="email" label="Your Email" onChange={onEmail}/>
    <ImageForm onChange={onDrop}/>
    <TextField required={true} type="text" label="Copyright Owner" onChange={onCopyright}/>
    <div className={classes.buttons}>
    <Button size="small" variant="contained" onClick={onCancel}>Cancel</Button>
    <Button disabled={!ready()} size="small" color="primary" variant="contained" onClick={onUpload}>Upload</Button>
    </div>
  </div>;
};

export default FormWithFileUpload;