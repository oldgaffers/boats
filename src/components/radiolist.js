import React from 'react';
import Grid from '@material-ui/core/Grid';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

export function RadioList({ options, name, state, onChange }) {

    function handleChange(event) {
      if (onChange) {
        const s = state;
        s[name] = event.target.value;
        onChange(s);
      }
    }
  
    let value;
    if(state && state[name]) value = state[name].toLowerCase();
  
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
