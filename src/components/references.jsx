import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function logref([, year, edition]) {
    return (<a href='https://www.oga.org.uk/news/archive/gaffers_log.html'>Gaffers Log {year} edition {edition}</a>);
}

function cbref([, month, year, pages]) {
    let url = 'https://www.chelseamagazines.com/shop/?s=classic+boat';
    const d = new Date(`${month} ${year}`);    
    if (d>=(Date.parse('2016-01-01'))) {
        const m = d.toLocaleString('default', { month: 'long' }).toLowerCase()
        const y = d.getFullYear();
        url = `https://www.chelseamagazines.com/shop/product/classic-boat-${m}-${y}/`;
    }
    return (<a href={url}>Classic Boat {month} {year} {pages}</a>);
}

/*
function getMonthFromString(mon){
    const d = Date.parse(mon + "1, 2012");
    if(!isNaN(d)){
       return new Date(d).getMonth() + 1;
    }
    return -1;
}
*/
 
function csref([, month, year, pages]) {
    // const m = getMonthFromString(month);
    // const n = year - 2009 + m + 7;
    // const url = `https://issuu.com/danhouston15/docs/cs${n}`;
    const url = 'https://classicsailor.com/magazine-archive/';
    return (<a href={url}>Classic Sailor {month} {year} {pages}</a>);
}

function process(ref) {
    if(ref && ref !== 'null') {
        let arr = ref.match(/Log (.*)\/(.*)/);
        if (arr) return logref(arr);
        arr = ref.match(/CB *([^ ]*) *([^ ]*) *(.*)/);
        if (arr) return cbref(arr);
        arr = ref.match(/Classic Sailor *([^ ]*) *([^ ]*) *(.*)/);
        if (arr) return csref(arr);
        return ref;
    }
    return '';
}

export default function References({boat}) {
    if(boat.reference) {
        return (
            <>
            <Typography><Box fontWeight="bold" component="span">References:</Box></Typography>
            {boat.reference.map((ref) => (<div>{process(ref)}</div>))}
            </>
        );    
    }
    return '';
}