import React, { useMemo } from 'react';

import FormFieldGrid from '../form-field-grid/form-field-grid';
import { validationError } from '../validation-error/validation-error';
import DDFSelect from '@data-driven-forms/common/select';
import parseInternalValue from '@data-driven-forms/common/select/parse-internal-value';
import { useFieldApi } from '@data-driven-forms/react-form-renderer';
import { CircularProgress } from '@mui/material';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Autocomplete } from '@mui/material';

/**
 * Returns label of selected option
 * @param {Object|Array} option currently selected option
 * @param {Array<Object>} options all options avaiable
 * @returns {String}
 */
export const getOptionLabel = (option, options) => {
  if (typeof option === 'undefined') {
    return '';
  }

  if (option === '') {
    return '';
  }

  if (Array.isArray(option) && option.length === 0) {
    return '';
  }

  if (typeof option === 'object') {
    return option.label;
  }

  const item = options.find(({ value }) => value === option);
  return (item && item.label) || '';
};

/**
 * Function that creates correct DDF select value format
 * @param {Object|Array} option currently selected values
 * @param {Boolean} isMulti multiple select flag
 * @returns {Object|Array<Object>}
 */
export const createValue = (option, isMulti) => {
  if (isMulti) {
    return Array.isArray(option) ? option.map((item) => (typeof item === 'object' ? item : { value: item })) : option;
  }

  return option;
};

const NewItemDialog = (props) => {
  return (
        <Dialog open={props.open} onClose={props.onClose}>
        <form onSubmit={props.onSubmit}>
          <DialogTitle>Add a new item</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Did you miss any item in our list? Please, add it!
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              value={props.value}
              onChange={props.onChange}
              label={props.label}
              type="text"
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={props.onCancel}>Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </Dialog>
    );
};

const InternalSelect = ({
  value,
  options,
  label,
  helperText,
  validateOnMount,
  meta,
  isSearchable,
  description,
  classNamePrefix,
  isMulti,
  placeholder = 'Please choose',
  onInputChange,
  isFetching,
  noOptionsMessage,
  hideSelectedOptions,
  closeMenuOnSelect,
  required,
  onChange,
  onFocus,
  onBlur,
  FormFieldGridProps = {},
  TextFieldProps: { inputProps: textFieldInputProps, ...TextFieldProps } = {},
  inputProps = {},
  isClearable,
  isDisabled,
  loadingText = 'Loading...',
  ...rest
}) => {
  const invalid = validationError(meta, validateOnMount);
  // When isMulti is true, the "parseInternalValue" always creates new value array, we need to memoize it to not create new array instance
  // Memo is required to fix https://github.com/data-driven-forms/react-forms/issues/1366
  const internalValue = useMemo(() => parseInternalValue(value, isMulti), [value, isMulti]);

  return (
    <FormFieldGrid {...FormFieldGridProps}>
      <Autocomplete
        filterSelectedOptions={hideSelectedOptions}
        disabled={isDisabled}
        disableClearable={isClearable}
        popupIcon={isFetching ? <CircularProgress size={20} color="inherit" /> : <ArrowDropDownIcon />}
        fullWidth
        loadingText={loadingText}
        {...rest}
        renderInput={(params) => (
          <TextField
            onFocus={onFocus}
            onBlur={onBlur}
            {...params}
            required={required}
            error={!!invalid}
            helperText={invalid || ((meta.touched || validateOnMount) && meta.warning) || helperText || description}
            label={label}
            margin="normal"
            {...TextFieldProps}
            inputProps={{
              ...params.inputProps,
              ...textFieldInputProps,
              ...inputProps,
              readOnly: !isSearchable,
              placeholder: !internalValue || internalValue.length === 0 ? placeholder : undefined,
            }}
          />
        )}
        noOptionsText={noOptionsMessage()}
        onInputChange={(_event, value) => onInputChange(value)}
        options={options}
        multiple={isMulti}
        getOptionLabel={(option) => getOptionLabel(option, options)}
        value={typeof internalValue === 'undefined' ? null : internalValue}
        onChange={(_event, option) => onChange(createValue(option, isMulti))}
        loading={isFetching}
      />
    </FormFieldGrid>
  );
};

const Freesolo = (props) => {
  const {
    input,
    isRequired,
    isDisabled,
    isReadOnly,
    disabled,
    multiple,
    isMulti,
    isClearable,
    disableClearable,
    loadingMessage,
    loadingText,
    noOptionsMessage,
    noOptionsText,
    closeMenuOnSelect,
    ...rest
  } = useFieldApi(props);
  
  const [open, toggleOpen] = React.useState();
  const [dialogValue, setDialogValue] = React.useState();
  
  const handleSelectChange = (event, newValue) => {
          if (typeof newValue === 'string') {
            // timeout to avoid instant validation of the dialog's form.
            setTimeout(() => {
              toggleOpen(true);
              setDialogValue(newValue);
            });
          } else if (newValue && newValue.inputValue) {
            toggleOpen(true);
            setDialogValue(newValue);
          } else {
            setValue(newValue);
          }
        };
  
  const handleDialogSubmit = (e) => {
    console.log("handleDialogSubmit", e);
    };
  
  return (
    <>
    <DDFSelect
      {...input}
      isMulti={multiple || isMulti}
      required={isRequired}
      disabled={isDisabled || isReadOnly || disabled}
      disableClearable={!isClearable || disableClearable}
      loadingText={loadingMessage || loadingText}
      noOptionsMessage={noOptionsMessage || noOptionsText}
      {...rest}
      SelectComponent={InternalSelect}
      onChange={handleSelectChange}
    />
    <NewItemDialog
      open={open}
      value={dialogValue}
      label="item TODO"
      onClose={() => console.log("dialog close")}
      onCancel={() => console.log("dialog cancel")}
      onSubmit={handleDialogSubmit}
      />
    </>
  );
};

export default Freesolo;