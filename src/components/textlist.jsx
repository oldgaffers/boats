import React from 'react';
import Typography from '@mui/material/Typography';

export default function TextList({ fields, data }) {
    const r = [];
    Object.keys(fields).forEach(key => {
        const val = fields[key].access(data, key);
        if(val) {
            r.push({ key, label: fields[key].label, text: val });
        }
    });
    return (<div>{r.map(n => (<Typography 
        sx={{margin:0}}
        key={n.key}>{`${n.label}: ${n.text}`}</Typography>))}</div>);
}
