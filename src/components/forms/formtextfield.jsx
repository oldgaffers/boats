import React from 'react';
import TextField from "@mui/material/TextField";

export default function FormTextField({ prefix, label, state, onChange, type="text", name }) {
  
  let key = name || label.replace(/ /g, '_').toLowerCase();
  if (prefix) {
    key = `${prefix}_${key}`;
  }

  function handleChange(event) {
    if (onChange) {
      const s = state;
      s[key] = event.target.value;
      onChange(s);
    }
  }

  return (<TextField
    label={label}
    fullWidth
    variant="outlined"
    type={type}
    value={state[key]}
    onChange={handleChange}
    name={key} />);
}