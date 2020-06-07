import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

function Picker({ options, id, label, onChange, value, clearable = true }) {
  const [inputValue, setInputValue] = useState('');
  function handleChange(event, option, reason) {
    let value;
    switch (reason) {
      case 'input':
        value = '';
        break;
      case 'reset':
        if (option) value = option;
        else value = options[0].name;
        break;
      case 'clear':
        value = '';
        setInputValue('');
        break;
      case 'select-option':
        value = option.name;
        setInputValue(value);
        break;
      default:
        console.log('unrecognised reason', reason);
    }
    console.log(
      id,
      'onChange',
      reason,
      'value',
      value || 'undefined',
      'option',
      option || 'undefined',
    );
    onChange(id, value);
  }

  function v(option, value) {
    //console.log(`${id} getOptionSelected ${option.name} !${value}!`);
    if(!value) return false;
    if(value === '""') console.log(`${id} getOptionSelected ${option.name} !${value}!`);
    if(value.name) return option.name === value.name;
    return option.name === value;
  }

  // console.log(id, 'picker render', value);
  if (value && value !== inputValue) {
    setInputValue(value);
  }

  return (
    <Autocomplete
      id={id}
      options={options}
      getOptionSelected={(option, value) => v(option,value)}
      getOptionLabel={(option) => option.name?option.name:option}
      value={value||''}
      onChange={(event, option, reason) => handleChange(event, option, reason)}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label={label} variant="outlined" />
      )}
      disableClearable={!clearable}
    />
  );
}

export default Picker;
