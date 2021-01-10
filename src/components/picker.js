import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

export default function Picker({ options, id, label, onChange, value, clearable=true}) {

  const [value0, setValue0] = useState(value);

  return (<Autocomplete
      disableClearable={!clearable}
      options={options.map(o => o.name)}
      id={id}
      value={value0}
      onChange={(_, newValue) => {
          setValue0(newValue);
          onChange(id, newValue);
      }}
      renderInput={(params) => <TextField {...params} label={label} margin="normal" />}
    />);
};

