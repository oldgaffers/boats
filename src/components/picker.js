import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
// import { validate } from 'graphql';

function Picker({ options, id, label, onChange, value, clearable = true }) {

  const [inputValue, setInputValue] = useState('');

  if (typeof options === 'string') {
    const data = JSON.parse(sessionStorage.getItem(options));
    if(data) {
      options = data;
    }
  }

  function handleChange(event, option, reason) {
    let val;
    switch (reason) {
      case 'input':
        // validate = '';
        break;
      case 'reset':
        if (option) {
          val = option;          
        } else {
          val = options[0].name;
        }
        break;
      case 'clear':
        val = '';
        setInputValue('');
        break;
      case 'select-option':
        val = option.name;
        setInputValue(val);
        break;
      default:
        console.log('unrecognised reason', reason);
    }
    console.log(
      id,
      'onChange',
      reason,
      'value',
      val || 'undefined',
      'option',
      option || 'undefined',
    );
    onChange(id, val);
  }

  function v(option, val) {
    //console.log(`${id} getOptionSelected ${option.name} !${val}!`);
    if(!val) return false;
    if(val === '""') console.log(`${id} getOptionSelected ${option.name} !${val}!`);
    if(val.name) return option.name === val.name;
    return option.name === val;
  }

  // console.log(id, 'picker render', value);
  if (value && value !== inputValue) {
    setInputValue(value);
  }

  return (
    <Autocomplete
      id={id}
      options={options}
      getOptionSelected={(option, val) => v(option,val)}
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
