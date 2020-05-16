import React from 'react';
import { 
    Button, Card, CardActions, CardActionArea, CardContent, CardMedia, Typography
} from '@material-ui/core';
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
    <CardActionArea>
        {(boat.thumb)?(
        <CardMedia
          className={classes.cardMedia}
          image={boat.thumb}
          title={boat.name}
        />):''}
      <CardContent className={classes.cardContent} >
        <Typography gutterBottom variant="h5" component="h2">
        {boat.name} ({boat.oga_no})
        </Typography>
        <Typography variant="body2" 
        dangerouslySetInnerHTML={{ __html: normaliseDescription(boat) }}
        />
        <TextList fields={wanted} data={boat} />
      </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" href={`boat/${boat.oga_no}/${sortDirection}`} variant="contained" color="secondary">More..</Button>
      </CardActions>
    </Card>
  );
}
