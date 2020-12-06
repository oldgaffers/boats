import React from 'react';
import {
  Grid,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Radio,
} from "@material-ui/core";
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export function RadioList({ options, name, state, onChange }) {

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

export function GqlRadioList({ list, name, state, onChange }) {

  const { loading, error, data } = useQuery(gql(`{
    ${list}(order_by: {name: asc}){name}
  }`));

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(GqlRadioList)</p>;

  function handleChange(event) {
    if (onChange) {
      const s = state;
      s[name] = event.target.value;
      onChange(s);
    }
  }

  let value;
  if(state && state[name]) value = state[name];

  const options = data[name];

  return (
      <FormControl component="fieldset">
      <RadioGroup row name={name} value={value} onChange={handleChange}>
        <Grid container>
        {
          options.map((item) => {
            let option = item;
            if (option.name) { option = option.name; }
            const v = option.replace(/ /g, '_').toLowerCase();
            return (<Grid key={`${name}.${v}`} item>
                <FormControlLabel 
                value={v}
                control={<Radio />} 
                label={option} 
                />
              </Grid>
            )
          })
        }
        </Grid>
      </RadioGroup>
    </FormControl>
  );
}