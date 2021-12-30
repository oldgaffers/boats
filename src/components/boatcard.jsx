import React from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import Checkbox from '@mui/material/Checkbox';
import TextList from './textlist';
import { price } from '../util/format';
import { boatUrl } from '../util/rr';

function makePreviousNamesField(n) {
  if (n && n.length>0) {
    try {
      return n.join(', ');
    } catch(e) {
      console.log(e);
    }
  }
  return undefined;
}

function showPrice(n) {
  if (n) return price(n);
  return undefined;
}

const wanted = {
    year: { label: 'Year Built', access: (n)=>n},
    place_built: { label: 'Place Built', access: (n)=>n},
    home_port: { label: 'Home Port', access: (n)=>n},
    rigType: { label: 'Rig Type', access: (n)=>n},
    designerByDesigner: { label: 'Designer', access: (n)=>n?n.name:n},
    builderByBuilder: { label: 'Builder', access: (n)=>n?n.name:n},
    previous_names: { label: 'Was', access: (n) => makePreviousNamesField(n)},
    price: { label: 'Price', access: (n) => showPrice(n)},
};

function SalesBadge({ boat, invisible, children }) {
  if (!boat.thumb) return children;
  if (!boat.for_sale_state) return children;
  switch (boat.for_sale_state.text) {
    case 'for_sale':
      return (<Badge invisible={invisible} badgeContent="For sale" color="secondary">{children}</Badge>);
    case 'sold':
      return (<Badge badgeContent="Sold" color="primary">{children}</Badge>);
    default:
      return children;
  }
}

function normaliseDescription(boat) {
  if (boat && boat.short_description) {
    const desc = boat.short_description.trim();
    if (desc.startsWith('<')) {
      return desc;
    }
    return `<div>${desc}</div>`;
  }
  return '';
}

function AltForThumb() {
  // return 'know anyone who can add a photo?';
  return '';
}

export default function BoatCard({ state, boat, marked, onMarkChange }) {
  // const location = useLocation();
  const sale = state.view.sale;

  const mark = (event) => {
    if(onMarkChange) {
      onMarkChange(event.target.checked, boat.oga_no);
    }
  };

  return (
    <Card sx={boat.thumb ? {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'} : {}}>
      {boat.thumb?(<CardMedia sx={{paddingTop: '100%'}} image={boat.thumb} title={boat.name} />):(<AltForThumb/>)}
      <CardContent sx={{flexGrow: 1}} >
        <Typography gutterBottom variant="h5" component="h2">
          <SalesBadge invisible={sale} boat={boat}>{boat.name} ({boat.oga_no})</SalesBadge>
        </Typography>
        <Typography variant="body2" 
        dangerouslySetInnerHTML={{ __html: normaliseDescription(boat) }}
        />
        <TextList fields={wanted} data={boat} />
      </CardContent>
      <CardActions>
        <Grid container justifyContent="space-between">
        <Grid item>
        <Button
          size="small" 
          component={'a'}
          href={boatUrl(boat.oga_no, {})}
          variant="contained" 
          color="secondary"
        >More..</Button>
        </Grid>
        <Grid item>
        <Checkbox sx={{textAlign: 'right'}}
        checked={marked}
        color="primary" onChange={mark}
        inputProps={{ 'aria-label': 'add to list' }}
      />
        </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
}
