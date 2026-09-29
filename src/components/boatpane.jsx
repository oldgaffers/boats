import React from 'react';
import Paper from '@mui/material/Paper';
import ConditionalText from './conditionaltext';
import { toTitleCase } from '../util/text_utils';
import { formatList } from '../util/format';

function textvalue(data, key) {
    const o = data[key];
    if (o) {
      if (Array.isArray(o)) {
          return formatList(data, key);
      }
      if (Object.keys(o).includes('approx')) {
          if (o.value && o.approx) {
              return `around ${data[key].value}`;
          }
          return o.value
      }
      if (o.value) {
          return o.value;
      }
    }
    if (key.field) {
        const val = data[key.field];
        if (key.df) {
            return key.df(val);
        }
        if (key.unit) {
            return `${val} ${key.unit}`;
        }
        return val;
    }
    if (o?.name) {
        return o.name;
    }
    return o;
}

function row({ field, data }) {
    const text = `${textvalue(data, field) || ''}`.trim();
    const l = toTitleCase((field.field || field).replace(/_/g, ' '))
    const label = field.abbr ? `${l} (${field.abbr})` : l;
    return { text, label };
}

export function TextPane({ data, fields }) {
    const rows = fields.map(field => row({ field, data })).filter(r => r.text && r.text.length > 0);
    return (
        <Paper>
            {rows.map(({ text, label }) => (<ConditionalText key={label} label={label} value={text} />))}
        </Paper>
    );
}