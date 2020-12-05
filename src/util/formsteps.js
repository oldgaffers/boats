import React from 'react';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

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
        {onNext ? (
          <Button variant="contained" onClick={onNext}>
            Next
          </Button>
        ) : (
          <Button variant="contained" onClick={onSubmit}>
            Submit
          </Button>
        )}
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
