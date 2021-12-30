import React from 'react';
import Typography from "@mui/material/Typography";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function ComboBox({ name, label, state, onChange, options }) {
    const key = name || label.replace(/ /g, '_').toLowerCase();
  
    function handleChange(event, value, reason) {
      const newstate = {...state};
      if (value === null) {
        newstate[key] = '';
      } else {
        newstate[key] = value;
      }
      onChange(newstate);
    }
  
    return (
      <>
        <Typography>{label}</Typography>
        <Autocomplete
          options={options} 
          defaultValue=""
          inputValue={state[key]}               
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} label={label} variant="outlined" />}
        />
        </>
    );
  }