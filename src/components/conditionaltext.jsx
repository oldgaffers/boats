import React from 'react';
import Typography from '@mui/material/Typography';

export default function ConditionalText({ label, value }) {
    if (!value) {
        return '';
    }
    let text;
    if (Array.isArray(value)) {
        text = value.join(', ');
    } else {
        switch (typeof value) {
            case 'string':
                if (text === 'null') {
                    text = '';
                } else {
                    text = value;
                }
                break;
            case 'object':
                text = text.name || '';
                break;
            default:
                text = '';
        }
    }
    text = text.replace(/_/g, ' ');
    return (<div><Typography variant='subtitle2' component='span'>{label}: </Typography><Typography variant="body1" component='span'>{text}</Typography></div>)
}
