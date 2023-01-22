import React, { useState, useContext, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Badge from '@mui/material/Badge';
import Checkbox from '@mui/material/Checkbox';
import TextList from './textlist';
import { boatUrl } from '../util/rr';
import { getThumb, getBoatData } from './boatregisterposts';
import { m2f, price } from '../util/format';
import Enquiry from './enquiry';
import { MarkContext } from "../browseapp";
import { currentSaleRecord } from '../util/sale_record';
import EndOwnership from './endownership';

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
  year: { label: 'Year Built', access: (b, k) => b[k] },
  place_built: { label: 'Place Built', access: (b, k) => b[k] },
  home_port: { label: 'Home Port', access: (b, k) => b[k] },
  rig_type: { label: 'Rig Type', access: (b, k) => b[k] },
  length_on_deck: { label: 'Length', access: (b, k) => m2f(b?.handicap_data?.[k]) }, 
  designer: { label: 'Designer', access: (b, k) => b[k]?.name || b[k] },
  design_class: { label: 'Design Class', access: (b, k) => b[k]?.name || b[k] },
  builder: { label: 'Builder', access: (b, k) => b[k]?.name || b[k] },
  previous_names: { label: 'Was', access: (b, k) => makePreviousNamesField(b[k]) },
  price: { label: 'Price', access: (b, k) => showPrice(b[k]) },
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

function BoatCardWords({ boat, owned, wanted }) {

  if (boat.loading) {
    return <>
      <Skeleton variant='rounded' animation='wave' height={40} />
      <Skeleton variant='rounded' animation='wave' height={80} />
    </>;
  }


  if (owned) {

  }

  return (
    <>
      <Typography variant="body2" component='div'
        dangerouslySetInnerHTML={{ __html: normaliseDescription(boat) }}
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          '-webkit-line-clamp': '3',
          lineClamp: '3',
          '-webkit-box-orient': 'vertical',
        }}
      />
      <TextList fields={wanted} data={boat} />
    </>
  );
}

function BoatCardImage({ albumKey, name }) {
  const [data, setData] = useState();

  useEffect(() => {
    if (!data) {
      getThumb(albumKey).then((r) => {
        setData(r.data);
      }).catch((e) => console.log(e));
    }
  }, [data, albumKey]);

  if (!data) {
    return <>
      <Skeleton variant='rounded' animation='wave' height={260} />
    </>
  }


  if (data.ThumbnailUrl) {
    return (<CardMedia sx={{ paddingTop: '100%' }} image={data.ThumbnailUrl} title={name} />);
  }
  return (<AltForThumb />);
}

export function CompactBoatCard({ view='app', ogaNo }) {
  const [data, setData] = useState();

  useEffect(() => {
    if (!data) {
      getBoatData(ogaNo).then((r) => {
        setData(r.data);
      }).catch((e) => console.log(e));
    }
  }, [data, ogaNo]);

  const { boat } = data?.result?.pageContext || { boat: { oga_no: ogaNo, name: '', loading: true } };

  const albumKey = boat?.image_key;
  return (
    <Card sx={albumKey ? {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    } : {}}>
      {albumKey ? <BoatCardImage albumKey={albumKey} name= {boat?.name} /> : ''}
      <CardContent sx={{ flexGrow: 1 }} >
        <BoatCardWords boat={{ ...boat }} wanted={[]} />
      </CardContent>
      <CardActions>
        <Enquiry boat={boat} text='Contact' />
      </CardActions>
    </Card>
  );
}

export default function BoatCard({ state, onMarkChange, ogaNo }) {
  const markList = useContext(MarkContext);
  const [marked, setMarked] = useState(markList.includes(ogaNo));
  const [data, setData] = useState();
  const { user } = useAuth0();

  useEffect(() => {
    if (!data) {
      getBoatData(ogaNo).then((r) => {
        setData(r.data);
      }).catch((e) => console.log(e));
    }
  }, [data, ogaNo]);

  const handleMarked = (checked) => {
    setMarked(checked);
    onMarkChange(checked, ogaNo);
  }

  if (!data) {
    return <CircularProgress/>;
  }

  const { boat } = data?.result?.pageContext || { boat: { oga_no: ogaNo, name: '', loading: true } };

  const currentSR = currentSaleRecord(boat);
  const price = currentSR?.asking_price;

  const id = user?.["https://oga.org.uk/id"];

  const current = boat?.ownerships?.filter((o) => o.current);
  const owned = current?.find((o) =>  o.id === id);

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
        <BoatCardWords boat={{ ...boat, price }} owned={owned} wanted={wanted} />
      </CardContent>
      <CardActions>
        <Grid container
        justifyContent="space-between"
        >
          <Grid item>
              <Button
                padding='5px'
                size="small"
                component={'a'}
                href={boatUrl(ogaNo, {})}
                variant="contained"
                color="primary"
              >More..</Button>
          </Grid>
          <Grid item>
            {owned ?
              <EndOwnership boat={{ ...boat }} owned={owned} user={user} />
            :
              <Enquiry boat={boat} text='Contact' />
            }
          </Grid>
          <Grid item>
          {owned ?
              ''
            :
            <Checkbox sx={{ textAlign: 'right' }}
              checked={marked}
              color="success" onChange={(event, checked) => handleMarked(checked)}
              inputProps={{ 'aria-label': 'add to list' }}
            />
            }
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
}
