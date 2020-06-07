import React from 'react';
import {
  Grid,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Radio,
} from "@material-ui/core";

export default function RadioList({ options, name, state, onChange }) {

    function handleChange(event) {
      if (onChange) {
        const s = state;
        s[name] = event.target.value;
        onChange(s);
      }
    }
  
    let value;
    if(state && state[name]) value = state[name];
  
    return (
        <FormControl component="fieldset">
        <RadioGroup row name={name} value={value} onChange={handleChange}>
          <Grid container>
          {
            options.map((option) => {
              const v = option.replace(/ /g, '_').toLowerCase();
              return (<Grid key={`${name}.${v}`} item>
                <FormControlLabel 
                value={v}
                control={<Radio />} 
                label={option} 
                />
              </Grid>)
            })
          }
          </Grid>
        </RadioGroup>
      </FormControl>
    );
  }