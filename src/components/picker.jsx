import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function Picker({ options, id, label, onChange, value, clearable=true}) {

  const [value0, setValue0] = useState(value || '');

  const opt = options.map(o => o.name);
  opt.push(''); // not set is an allowed value

  return (<Autocomplete  
    sx={{boxSizing: 'content-box'}}    
    disableClearable={!clearable}
    options={opt}
    id={id}
    value={value0}
    onChange={(_, newValue) => {
        setValue0(newValue);
        onChange(id, newValue===''?undefined:newValue);
    }}
    renderInput={(params) => <TextField sx={{
      marginTop: '3px', marginLeft: '1em', marginRight: '1em', borderRightWidth: '1vw', width: '100%'
      }} {...params} label={label} variant="outlined"/>}
    />);
};

