import React from 'react';
import { TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'

function Picker({ options, id, label, onChange, value, defaultValue='', clearable=true }) {
    return (
        <Autocomplete
        inputValue={value}
        id={id}
        options={options}
        getOptionSelected={(option, value) => {
            return option.name === value;
        }}
        getOptionLabel={(option) => {
            if (id === 'sort-field') {
                console.log(id,'getOptionLabel', option.name, option);
            }
            return option.name;
        }}
        onChange={(event, value, reason) => {
            console.log(id, 'onChange', value, reason);
        }}
        onInputChange={(event, option, reason) => {
            let value = defaultValue;
            if (reason !== 'reset') {
                value = option.name;
            }
            console.log(id, 'onInputChange', value, reason);
            onChange(id, value);
        }} 
        renderInput={(params) => <TextField {...params}  label={label} variant="outlined" />}
        disableClearable={!clearable}
        />
    );
}

export default Picker