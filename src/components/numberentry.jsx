import React from 'react'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function NumberEntry({id, label, value, onSet, onClear}) {
  return (
    <Autocomplete
      id={id || label.replace(/ /g, '')}
      value={value}
      freeSolo
      onInputChange={(event, value, reason) => {
        if (reason === "input") {
          onSet(value);
        }
        if (reason === "clear") {
          onClear()
        }
      }}
      options={[]}
      renderInput={(params) => (
        <TextField
          sx={{
            marginTop: "3px",
            marginLeft: "15px",
            marginRight: "15px",
          }}
          {...params}
          label={label}
          variant="outlined"
        />
      )}
    />
  );
}
