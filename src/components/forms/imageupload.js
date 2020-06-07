import React from 'react';
import Typography from "@material-ui/core/Typography";
import {DropzoneArea} from 'material-ui-dropzone'

function ImageUpload({ state, onChange }) {

  function handleUpload(files) {
    onChange({ ...state, files: files });
    console.log(files);
  }

  return (
      <>
      <Typography>Upload some Pictures</Typography>
      <DropzoneArea
        onChange={handleUpload}
        name="images"
        />
    </>
  );
}

export default ImageUpload;
