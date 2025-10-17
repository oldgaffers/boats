import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

export default function TextList({ variant='body2', fields, data }) {
    const r = [];
    Object.keys(fields).forEach(key => {
        const val = fields[key].access(data, key);
        if(val) {
            r.push({ key, label: fields[key].label, text: val });
        }
    });
    return (<Box>{r.map(n => (<Typography variant={variant} component="div"
        sx={{margin:0}}
        key={n.key}>{`${n.label}: ${n.text}`}</Typography>))}</Box>);
}
