import React from 'react';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Box from '@material-ui/core/Box';
import { flexbox } from '@material-ui/system';

export function Step({
  step,
  currentStep,
  onNext,
  onPrev,
  children,
  disabled,
  onSubmit,
  onCancel
}) {
  if (currentStep !== step) {
    return null;
  }
  return (
    <Box alignContent="stretch">
        <DialogContent>{children}</DialogContent>
        <DialogActions alignContent="flex-end">
          <Button onClick={onCancel} color="primary">
            Cancel
          </Button>
          {onPrev ? (
            <Button variant="contained" onClick={onPrev}>
              Back
            </Button>
          ) : (
           ''
          )}
          <Button variant="contained" onClick={onNext}>
            Next
          </Button>
        </DialogActions>
    </Box>
  );
}

export function JumpStep({
  children,
  step,
  currentStep,
  onNext,
  onPrev,
  onJump,
  onCancel,
  nextLabel,
  jumpLabel,
}) {
  if (currentStep !== step) {
    return null;
  }
  return (
    <>
    <DialogContent>
    {children}
    </DialogContent>
    <DialogActions>
        <Button onClick={onCancel} color="primary">
            Cancel
        </Button>
        <Button variant="contained" onClick={onPrev}>
          Back
        </Button>
        <Button variant="contained" onClick={onNext}>
          {nextLabel}
        </Button>
        <Button variant="contained" onClick={onJump}>
          {jumpLabel}
        </Button>
      </DialogActions>
    </>
  );
}

export function Submit({
  step,
  currentStep,
  onPrev,
  children,
  onSubmit,
  onCancel
}) {
  if (currentStep !== step) {
    return null;
  }
  return (
    <>
    <DialogContent>
    {children}
    </DialogContent>
    <DialogActions>
        <Button onClick={onCancel} color="primary">
            Cancel
        </Button>
        {onPrev ? (
          <Button variant="contained" onClick={onPrev}>
            Back
          </Button>
        ) : (
          ''
        )}
        <Button variant="contained" onClick={onSubmit}>
          Submit
        </Button>
      </DialogActions>
    </>
  );
}
