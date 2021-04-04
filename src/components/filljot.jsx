import React from 'react';
import queryString from 'query-string';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

export default function FillJot({ className, boat, email, disabled, children }) {

  /*
  function m2f(m) {
    return (100*m/2.54/12);
  }
  */

  async function handleClick() {
    const form = 'https://form.jotform.com/201591501001335';
    
    const params = {
        email,
        name: boat.name,
        oga_no: boat.oga_no,
      };
    const query = queryString.stringify(params);
    window.open(`${form}?${query}`, "_blank");
  }

  return (<Button
    size="small"
    variant="contained"
    color="primary"
    disabled={disabled}
    className={className}
    endIcon={<Icon>send</Icon>}
    onClick={handleClick}
  >
    {children}
  </Button>);
}

