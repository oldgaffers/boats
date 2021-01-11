import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

export default function Picker({ options, id, label, onChange, value, clearable=true}) {

  const [value0, setValue0] = useState(value || '');

  const opt = options.map(o => o.name);
  opt.push(''); // not set is an allowed value

  return (<Autocomplete
      disableClearable={!clearable}
      options={opt}
      id={id}
      value={value0}
      onChange={(_, newValue) => {
          setValue0(newValue);
          onChange(id, newValue===''?undefined:newValue);
      }}
      renderInput={(params) => <TextField {...params} label={label} margin="normal" />}
    />);
};

