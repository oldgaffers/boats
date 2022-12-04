import React from "react";
import Button from "@mui/material/Button";

export default function AddToFleet({ markList=[], fleet }) {
    console.log('AddToFleet', markList, fleet);

    if (markList?.length === 0) {
        return '';
    }

    if (!fleet) {
        return '';
    }

    return (
        <Button>Add {markList.length} marked boats to {fleet}</Button>
    );
}