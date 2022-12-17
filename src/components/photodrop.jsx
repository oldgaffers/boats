import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import {useDropzone} from 'react-dropzone';

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

export default function Photodrop({ onDrop }) {
  const [files, setFiles] = useState([]);
  const {getRootProps, getInputProps} = useDropzone({
    accept: {
      'image/*': []
    },
    maxSize: 5242880,
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    }
  });
  
  const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          alt=''
          src={file.preview}
          style={img}
          // Revoke data uri after image is loaded
          onLoad={() => { URL.revokeObjectURL(file.preview) }}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    onDrop(files);
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files, onDrop]);

  return (
    <Stack>
      <Box sx={{ padding: 1, borderRadius: 2, border: '1px dashed' }} {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some pictures here, or click to select files</p>
      </Box>
      <Box styleName={thumbsContainer}>
        {thumbs}
      </Box>
    </Stack>
  );
}