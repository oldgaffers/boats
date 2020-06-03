import React from 'react';
import { TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'

function Picker({ options, id, label, onChange, value, clearable=true }) {
    return (
        <Autocomplete
        inputValue={value}
        id={id}
        options={options}
        getOptionSelected={(option, value) => {
            return option.name === value;
        }}
        getOptionLabel={(option) => option.name}
        onChange={(event, value, reason) => {
            onChange(id, value);
        }} 
        renderInput={(params) => <TextField {...params}  label={label} variant="outlined" />}
        disableClearable={!clearable}
        />
    );
}

export default Picker