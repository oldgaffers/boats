import React from 'react';
import { TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'

function Picker({ options, id, label }) {
    return (
        <Autocomplete
        id={id}
        options={options}
        getOptionLabel={(option) => option.name}
        renderInput={
            (params) => <TextField {...params} 
            label={label}
            variant="outlined" />}
        />
    );
}

export default Picker