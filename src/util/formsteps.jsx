import React from 'react';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

export function Step({
  step,
  currentStep,
  onNext,
  onPrev,
  children,
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
        <Button variant="contained" onClick={onNext}>
          Next
        </Button>
      </DialogActions>
    </>
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