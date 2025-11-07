import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormFieldGrid, validationError } from '@data-driven-forms/mui-component-mapper'
import { useFieldApi, useFormApi } from '@data-driven-forms/react-form-renderer';
import { Stack } from '@mui/material';

const TextFieldWithButton = (props) => {
  const {
    input,
    isReadOnly,
    isDisabled,
    placeholder,
    isRequired,
    label,
    helperText,
    description,
    validateOnMount,
    meta,
    inputProps,
    FormFieldGridProps,
    addsTo,
    ...rest
  } = useFieldApi(props);
  const invalid = validationError(meta, validateOnMount);
    const { change, getFieldState } = useFormApi();

  const handleClick = (e) => {
    console.log(props.name, 'click', addsTo);
    // const l = getFieldState(addsTo);
    console.log(input);
    // change(addsTo, { name: input.value, label: input.value )};
  }
  return (
    <FormFieldGrid {...FormFieldGridProps}>
        <Stack direction='row'>
      <TextField
        {...input}
        fullWidth
        error={!!invalid}
        helperText={invalid || ((meta.touched || validateOnMount) && meta.warning) || helperText || description}
        disabled={isDisabled}
        label={label}
        placeholder={placeholder}
        required={isRequired}
        inputProps={{
          readOnly: isReadOnly,
          ...inputProps,
        }}
        {...rest}
        />
      <Button onClick={handleClick}>Add</Button>
      </Stack>
    </FormFieldGrid>
  );
};

export default TextFieldWithButton;