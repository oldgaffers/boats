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
import { boatUrl } from '../util/rr';
import { getThumb, getBoatData } from '../util/api';
import { m2f, price, formatList } from '../util/format';
import Enquiry from './enquiry';
import { MarkContext } from "./browseapp";
import { currentSaleRecord } from '../util/sale_record';
import EndOwnership from './endownership';
import TextList from './textlist';

function makePreviousNamesField(n) {
  if (n && n.length > 0) {
    try {
      return n.join(', ');
    } catch (e) {
      // console.log('makePreviousNamesField', e);
    }
  }
  return undefined;
}

const compactWanted = {
  length_on_deck: { label: 'Length', access: (b, k) => m2f(b?.handicap_data?.[k]) },
  year: { label: 'Year', access: (b, k) => b[k] },
};

const tl = { vertical: 'top', horizontal: 'left' };
// const tr = { vertical : 'top', horizontal : 'right' };
const bl = { vertical: 'bottom', horizontal: 'left' };

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

function CrewingBadge({ boat, view, children }) {
  if (view === 'sail') {
    return children;
  }
  if (boat?.crewing) {
    return (<Badge anchorOrigin={tl} badgeContent="crew on her" color="info">{children}</Badge>);
  }
  return children;
}

function HireBadge({ boat, view, children }) {
  if (view === 'sail') {
    return children;
  }
  if (boat?.hire) {
    return (<Badge anchorOrigin={bl} badgeContent="hire her" color="info">{children}</Badge>);
  }
  return children;
}

function AltForThumb() {
  // return 'know anyone who can add a photo?';
  return '';
}

function EllipsisText({ variant = 'body2', html = '' }) {
  return <Typography variant={variant} component='div'
    dangerouslySetInnerHTML={{ __html: html.trim() }}
    sx={{
      display: '-webkit-box',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      lineClamp: '3',
      WebkitLineClamp: '3',
      WebkitBoxOrient: 'vertical',
    }}
  />
}

function BoatCardWords({ boat, wanted, variant = 'body2' }) {

  if (boat.loading) {
    return <>
      <Skeleton variant='rounded' animation='wave' height={40} />
      <Skeleton variant='rounded' animation='wave' height={80} />
    </>;
  }

  return (
    <>
      <EllipsisText variant={variant} html={boat.short_description} />
      <TextList variant={variant} fields={wanted} data={boat} />
    </>
  );
}

export function BoatCardImage({ albumKey, name }) {
  const [data, setData] = useState();

  const height = 220;

  useEffect(() => {
    if (!data && albumKey) {
      getThumb(albumKey).then((r) => {
        if (r) {
          setData(r);
        } else {
          setData({});
          console.log('failed to get thumb for albumKey', albumKey);
        }
      }).catch((e) => console.log(e));
    }
  }, [data, albumKey]);

  if (!albumKey) {
    return '';
  }

  if (!data) {
    return <>
      <Skeleton variant='rounded' animation='wave' height={height} />
    </>
  }
  // console.log('BoatCardImage data', data);
  if (data.ThumbnailUrl) {
    return (<CardMedia
      component="img"
      height={height}
      sx={{ objectFit: "contain" }}
      image={data.ThumbnailUrl}
      title={name}
    />);
  }
  return (<AltForThumb />);
}

export function CompactBoatCard({ view = 'app', ogaNo, wanted = compactWanted }) {
  const [data, setData] = useState();

  useEffect(() => {
    if (!data) {
      getBoatData(ogaNo).then((r) => {
        setData(r);
      }).catch((e) => console.log(e));
    }
  }, [data, ogaNo]);

  const { boat } = data?.result?.pageContext || { boat: { oga_no: ogaNo, name: '', loading: true } };
  return (
    <Card sx={{ width: 200 }}>
      <BoatCardImage albumKey={boat.image_key} name={boat.name} />
      <CardContent>
        <Typography variant='subtitle2'>{boat.name} ({boat.oga_no})</Typography>
        <BoatCardWords boat={boat} wanted={wanted} variant='caption' />
      </CardContent>
      <CardActions>
        <Button
          size="small"
          component={'a'}
          href={boatUrl(ogaNo, {})}
        >More</Button>
      </CardActions>
    </Card>
  );
}

export default function BoatCard({ state, onMarkChange, ogaNo }) {
  const markList = useContext(MarkContext);
  const [data, setData] = useState();
  const { user } = useAuth0();
  const marked = markList.includes(ogaNo);

  useEffect(() => {
    if (!data) {
      getBoatData(ogaNo).then((r) => {
        setData(r);
      }).catch((e) => console.log(e));
    }
  }, [data, ogaNo]);

  const handleMarked = (checked) => {
    onMarkChange(checked, ogaNo);
  }

  if (!data) {
    return <CircularProgress />;
  }

  const { boat } = data?.result?.pageContext || { boat: { oga_no: ogaNo, name: '', loading: true } };

  const currentSR = currentSaleRecord(boat);

  const wanted = {
    year: { label: 'Year Built', access: (b, k) => b[k] },
    place_built: { label: 'Place Built', access: (b, k) => b[k] },
    home_port: { label: 'Home Port', access: (b, k) => b[k] },
    rig_type: { label: 'Rig Type', access: (b, k) => b[k] },
    length_on_deck: { label: 'Length', access: (b, k) => m2f(b?.handicap_data?.[k]) },
    designer: { label: 'Designer', access: formatList },
    design_class: { label: 'Design Class', access: (b, k) => b[k]?.name || b[k] },
    builder: { label: 'Builder', access: formatList },
    previous_names: { label: 'Was', access: (b, k) => makePreviousNamesField(b[k]) },
  };

  if (currentSR) {
    wanted.asking_price = { label: 'Price', access: (b, k) => price(currentSR[k]) };
  }

  const id = user?.["https://oga.org.uk/id"];

  const current = boat?.ownerships?.filter((o) => o.current);

  const owned = id && current?.find((o) => o.id === id);

  const albumKey = boat?.image_key;
  return (
    <Card sx={albumKey ? {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    } : {}}>
      {albumKey ? <BoatCardImage albumKey={albumKey} name={boat?.name} /> : ''}
      <CardContent sx={{ flexGrow: 1 }} >
        <Typography gutterBottom variant="h5">
          <HireBadge boat={boat}>
            <CrewingBadge boat={boat}>
              <SalesBadge view={state.view} boat={boat}>
                {boat?.name || ''} ({ogaNo})
              </SalesBadge>
            </CrewingBadge>
          </HireBadge>
        </Typography>
        <BoatCardWords boat={boat} wanted={wanted} />
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
            <Checkbox sx={{ textAlign: 'right' }}
              checked={marked}
              color="success" onChange={(event, checked) => handleMarked(checked)}
              inputProps={{ 'aria-label': 'add to list' }}
            />
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
}
