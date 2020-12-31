import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

export default function ConditionalText({ label, value }) {
    if (value) {
        let text = Array.isArray(value)?value.join(', '):value;
        if (text.name) { text = text.name; }
        if (text !== '' && text !== 'null') {
            return (<Typography><Box fontWeight="bold" component="span">{label}:</Box> <Box component="span">{text}</Box></Typography>)
        }
    }
    return '';
}
