import React from 'react';
import { A } from 'hookrouter';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import TextList from './textlist';

const wanted = {
    year: { label: 'Year Built', access: (n)=>n},
    place_built: { label: 'Place Built', access: (n)=>n},
    home_port: { label: 'Home Port', access: (n)=>n},
    rigType: { label: 'Rig Type', access: (n)=>n},
    designerByDesigner: { label: 'Designer', access: (n)=>n?n.name:undefined},
    builderByBuilder: { label: 'Builder', access: (n)=>n?n.name:undefined},
    previous_names: { label: 'Was', access: (n)=>(n && n.length>0)?n.join(', '):undefined}
};

function SalesBadgeImage({ boat, children }) {
  if (!boat.thumb) return '';
  if (!boat.for_sale_state) return children;
  switch (boat.for_sale_state.text) {
    case 'for_sale':
      return (<Badge component="div" badgeContent="For sale" color="secondary">{children}</Badge>);
    case 'sold':
      return (<Badge component="div" badgeContent="Sold" color="primary">{children}</Badge>);
    default:
      return children;
  }
}

function SalesBadge({ boat, children }) {
  if (!boat.thumb) return '';
  if (!boat.for_sale_state) return children;
  switch (boat.for_sale_state.text) {
    case 'for_sale':
      return (<Badge badgeContent="For sale" color="secondary">{children}</Badge>);
    case 'sold':
      return (<Badge badgeContent="Sold" color="primary">{children}</Badge>);
    default:
      return children;
  }
}

export default function BoatCard({ sortDirection, boat, classes }) {

  function normaliseDescription(boat) {
    if (boat && boat.short_description) {
      const desc = boat.short_description.trim();
      if (desc.startsWith('<p>')) {
        return desc;
      }
      return `<p>${desc}</p>`;
    }
    return '';
  }

  return (
    <Card className={boat.thumb ? classes.card : classes.cardSmall}>
      <SalesBadgeImage boat={boat}>
        <CardMedia className={classes.cardMedia} image={boat.thumb} title={boat.name} />
      </SalesBadgeImage>
      <CardContent className={classes.cardContent} >
        <Typography gutterBottom variant="h5" component="h2">
        <SalesBadge boat={boat}>{boat.name} ({boat.oga_no})</SalesBadge>
        </Typography>
        <Typography variant="body2" 
        dangerouslySetInnerHTML={{ __html: normaliseDescription(boat) }}
        />
        <TextList fields={wanted} data={boat} />
      </CardContent>
      <CardActions>
        <Button 
          size="small" 
          component={A}
          href={`/boat/${boat.oga_no}`} 
          variant="contained" 
          color="secondary"
        >More..</Button>
      </CardActions>
    </Card>
  );
}
