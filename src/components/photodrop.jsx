import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useDropzone } from 'react-dropzone';

const maxMbyte = 10;
const maxSize = maxMbyte * 1024 * 1024; // 5MB

export default function Photodrop({ onDrop }) {
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': []
    },
    maxSize,
    onDropRejected: files => {
      files.forEach(file => {
        if (file.errors) {
          file.errors.forEach(err => {
            if (err.code === 'file-too-large') {
              alert(`File ${file.file.name} is too large. Max size is ${maxMbyte} MB.`);
            } else if (err.code === 'file-invalid-type') {
              alert(`File ${file.file.name} is not an image.`);
            } else {
              alert(`File ${file.file.name} error: ${err.message}`);
            }
          });
        }
      });
    },
    multiple: true,
    maxFiles: 10,
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    }
  });

  const thumbs = files.map(file => (
    <Box sx={{
      display: 'inline-flex',
      borderRadius: '2px',
      border: '1px solid #eaeaea',
      marginBottom: '8px',
      marginRight: '8px',
      width: '100px',
      height: '100px',
      padding: '4px',
      boxSizing: 'border-box'
    }} key={file.name}>
      <Box sx={{
        display: 'flex',
        minWidth: 0,
        overflow: 'hidden'
      }}>
        <img
          alt=''
          src={file.preview}
          style={{
            display: 'block',
            width: 'auto',
            height: '100%'
          }}
          // Revoke data uri after image is loaded
          onLoad={() => { URL.revokeObjectURL(file.preview) }}
        />
      </Box>
    </Box>
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
        <p>Drag 'n' drop some pictures here, or click to select files, max size is {maxMbyte} MB</p>
      </Box>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: '8px',
        marginBottom: '8px'
      }}>
        {thumbs}
      </Box>
    </Stack>
  );
}