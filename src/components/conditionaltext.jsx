import React from 'react';
import Typography from '@mui/material/Typography';

export default function ConditionalText({ label, value, children }) {
    console.log('CT', label, value);
    let text;
    if (value) {
        if (Array.isArray(value)) {
            text = value.join(', ');
        } else {
            switch (typeof value) {
                case 'number':
                    text = `${value}`;
                    break;
                case 'string':
                    if (text === 'null') {
                        text = '';
                    } else {
                        text = value;
                    }
                    break;
                case 'object':
                    text = value.name || '';
                    break;
                default:
                    text = '';
            }
        }
        text = text.replace(/_/g, ' ');
    } else {
        if (children) {
            text = children;
        }
    }
    if (!text) {
        return '';
    }
    return (<div><Typography variant='subtitle2' component='span'>{label}: </Typography><Typography variant="body1" component='span'>{text}</Typography></div>)
}
