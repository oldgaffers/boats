import React from 'react';
import Typography from '@mui/material/Typography';

export default function ConditionalText({ label, value }) {
    if (value) {
        let text = Array.isArray(value)?value.join(', '):value;
        if (text.name) { text = text.name; }
        if (text !== '' && text !== 'null') {
            return (<div><Typography variant='subtitle2' component='span'>{label}: </Typography><Typography variant="body1" component='span'>{text}</Typography></div>)
        }
    }
    return '';
}
