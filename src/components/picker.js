import React, { useState} from 'react';
import { TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'

function Picker({ options, id, label, onChange, defaultValue }) {
    const [value, setValue] = useState({name: defaultValue});
    return (
        <Autocomplete
        defaultValue={value}
        inputValue={defaultValue}
        id={id}
        options={options}
        getOptionSelected={(t,v)=>(t.name === v.name)}
        getOptionLabel={(option) => option.name}
        onInputChange={(_, value) => {
            setValue(value)
        }} 
        onChange={onChange}
        renderInput={
            (params) => <TextField {...params} 
            label={label}
            variant="outlined" />}
        />
    );
}

export default Picker