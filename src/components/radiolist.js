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

    let choices;
    if (typeof options[0] === 'object') {
      choices = options.map(({ name }) => name.toLowerCase());
    } else {
      choices = options.map((name) => name.toLowerCase());
    }
  
    let value;
    if(state && state[name]) value = state[name].toLowerCase();
  
    return (
        <FormControl component="fieldset">
        <RadioGroup row name={name} value={value} onChange={handleChange}>
          <Grid container>
          {
            choices.map((v) => {
              return (<Grid key={`${name}.${v.replace(/ /g, '_')}`} item>
                <FormControlLabel 
                value={v}
                control={<Radio />} 
                label={v} 
                />
              </Grid>)
            })
          }
          </Grid>
        </RadioGroup>
      </FormControl>
    );
  }
