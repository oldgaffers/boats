import React from 'react';
import Button from "@mui/material/Button";

export default function ProcessUpdatesButton() {

  return (
    <>
      <Button
        size="small"
        variant="contained"
        color='primary'
        href="/boat_register/pending/"
      >Process Boat Updates</Button>
    </>
  );
}