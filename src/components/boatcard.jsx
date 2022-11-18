import React, { useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
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
import { useAxios } from 'use-axios-client';
import { boatRegisterHome } from '../util/constants';

function makePreviousNamesField(n) {
  if (n && n.length > 0) {
    try {
      return n.join(', ');
    } catch (e) {
      console.log('makePreviousNamesField', e);
    }
  }
  return undefined;
}

function showPrice(n) {
  if (n) return price(n);
  return undefined;
}

const wanted = {
  year: { label: 'Year Built', access: (n) => n },
  place_built: { label: 'Place Built', access: (n) => n },
  home_port: { label: 'Home Port', access: (n) => n },
  rig_type: { label: 'Rig Type', access: (n) => n },
  designer: { label: 'Designer', access: (n) => n ? n.name : n },
  design_class: { label: 'Design Class', access: (n) => n ? n.name : n },
  builder: { label: 'Builder', access: (n) => n ? n.name : n },
  previous_names: { label: 'Was', access: (n) => makePreviousNamesField(n) },
  price: { label: 'Price', access: (n) => showPrice(n) },
};

function SalesBadge({ boat, view, children }) {
  switch (boat?.selling_status || '') {
    case 'for_sale':
      return (<Badge invisible={view === 'sell'} badgeContent="For sale" color="secondary">{children}</Badge>);
    case 'sold':
      return (<Badge badgeContent="Sold" color="primary">{children}</Badge>);
    default:
      return children;
  }
}

function AltForThumb() {
  // return 'know anyone who can add a photo?';
  return '';
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

function BoatCardWords({ boat }) {

  if (boat.loading) {
    return <>
      <Skeleton variant='rounded' animation='wave' height={40} />
      <Skeleton variant='rounded' animation='wave' height={80} />
    </>;
  }
  return (
    <>
      <Typography variant="body2"
        dangerouslySetInnerHTML={{ __html: normaliseDescription(boat) }}
      />
      <TextList fields={wanted} data={boat} />
    </>
  );
}

function BoatCardImage({ albumKey, name }) {
  const { loading, error, data } = useAxios(`https://7epryku6aipef3mzdoxtds3e5i0yfgwn.lambda-url.eu-west-1.on.aws/${albumKey}`);
  if (loading || !data) {
    return <>
      <Skeleton variant='rounded' animation='wave' height={260} />
    </>
  }
  if (error) {
    console.log(error);
  }

  if (data.ThumbnailUrl) {
    return (<CardMedia sx={{ paddingTop: '100%' }} image={data.ThumbnailUrl} title={name} />);
  }
  return (<AltForThumb />);
}

export default function BoatCard({ state, marked, onMarkChange, ogaNo }) {
  const { loading, error, data } = useAxios({
    url: `${boatRegisterHome}/boatregister/page-data/boat/${ogaNo}/page-data.json`,
  });
  const [markChecked, setMarkChecked] = useState(marked);

  const handleMarked = (checked) => {
    setMarkChecked(checked);
    onMarkChange(checked, ogaNo);
  }

  if (loading || !data) {
    // console.log('loading')
  }

  if (error) {
    console.log(error);
  }

  const { boat } = data?.result?.pageContext || { boat: { oga_no: ogaNo, name: '', loading: true } };

  // newest for sale record
  const price = ((boat?.selling_status || '') === 'for_sale')
    && boat?.for_sales?.reduce((prev, curr) =>
      (new Date(prev.created_at)
        >
        new Date(curr.created_at)
      ) ? prev : curr
    )?.asking_price;

  const albumKey = boat?.image_key;

  return (
    <Card sx={albumKey ? {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    } : {}}>
      {albumKey ? <BoatCardImage albumKey={albumKey} name= {boat?.name} /> : ''}
      <CardContent sx={{ flexGrow: 1 }} >
        <Typography gutterBottom variant="h5" component="h2">
          <SalesBadge view={state.view} boat={boat}>{boat?.name || ''} ({ogaNo})</SalesBadge>
        </Typography>
        <BoatCardWords boat={{ ...boat, price }} />
      </CardContent>
      <CardActions>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Button
              size="small"
              component={'a'}
              href={boatUrl(ogaNo, {})}
              variant="contained"
              color="secondary"
            >More..</Button>
          </Grid>
          <Grid item>
            <Checkbox sx={{ textAlign: 'right' }}
              checked={markChecked}
              color="primary" onChange={(event, checked) => handleMarked(checked)}
              inputProps={{ 'aria-label': 'add to list' }}
            />
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
}
