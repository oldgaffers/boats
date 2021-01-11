import React from 'react';
import { Link } from "gatsby";
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import { makeStyles } from '@material-ui/core/styles';
import TextList from './textlist';
import { price } from '../util/format';

// TODO make work in SPA mode

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

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '100%',
  },
  cardMediaSmall: {
    paddingTop: '56.25%',
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

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

export default function BoatCard({ filters, page, boatsPerPage, sortField, sortDirection, boat }) {
  const classes = useStyles();
  let qp = `p=${page}&bpp=${boatsPerPage}&sort=${sortField}&asc=${sortDirection==='asc'}`;
  for (const field of Object.keys(filters)) {
    if (field) {
      if (field === 'year') {
        const f = filters.year.firstYear || '';
        const l = filters.year.lastYear || '';
        qp = `${qp}&y=${f}-${l}`;
      } else {
        qp = `${qp}&${field}=${filters[field]}`;
      }
    }
  }
  return (
    <Card className={boat.thumb ? classes.card : classes.cardSmall}>
      {boat.thumb?(<CardMedia className={classes.cardMedia} image={boat.thumb} title={boat.name} />):(<AltForThumb/>)}
      <CardContent className={classes.cardContent} >
        <Typography gutterBottom variant="h5" component="h2">
          <SalesBadge invisible={filters.sale} boat={boat}>{boat.name} ({boat.oga_no})</SalesBadge>
        </Typography>
        <Typography variant="body2" 
        dangerouslySetInnerHTML={{ __html: normaliseDescription(boat) }}
        />
        <TextList fields={wanted} data={boat} />
      </CardContent>
      <CardActions>
        <Button
          size="small" 
          component={Link}
          to={`/browse_the_register/boat.html?oga_no=${boat.oga_no}&${qp}`}
          variant="contained" 
          color="secondary"
        >More..</Button>
      </CardActions>
    </Card>
  );
}

/* here is the SPA mode to prop:
import { Link } from "react-router-dom";
          to={{
            pathname: `/boat/${boat.oga_no}`,
            state: { filters, boatsPerPage, sortField, sortDirection }
          }}

          we should add page to state
*/