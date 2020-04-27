import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
    Button, Card, CardActions, CardActionArea, CardContent, CardMedia, Typography
} from '@material-ui/core';
import TextList from './textlist';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

const useStyles = makeStyles({
  root: {
    width: 300,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  media: {
    height: 300,
  }
});

const wanted = {
    year: { label: 'Year Built', access: (n)=>n},
    place_built: { label: 'Place Built', access: (n)=>n},
    home_port: { label: 'Home Port', access: (n)=>n},
    rigType: { label: 'Rig Type', access: (n)=>n},
    designerByDesigner: { label: 'Designer', access: (n)=>n?n.name:undefined},
    builderByBuilder: { label: 'Builder', access: (n)=>n?n.name:undefined},
    previous_names: { label: 'Was', access: (n)=>(n.length>0)?n.join(', '):undefined}
};

export default function BoatCard({ boat }) {

  const { loading, error, data } = useQuery
    (gql`query{thumb(id:${boat.oga_no})}`,
    { skip: !boat.image_key }
    );

  const classes = useStyles();

  if (error) return <p>Error: (BoatCards)</p>;
  
  if (loading) {
    if (data) {
      console.log('Loading set but data here');
    } else {
      return <p>Loading...</p>;
    }
  }

  return (
    <Card className={classes.root}>
    <CardActionArea>
        {(data && data.thumb)?(
        <CardMedia
          className={classes.media}
          image={data.thumb}
          title={boat.name}
        />):''}
      <CardContent>
        <Typography variant="h5" component="h2">
        {boat.name} ({boat.oga_no})
        </Typography>
        <Typography variant="body2" 
        dangerouslySetInnerHTML={{ __html: boat.short_description }}
        />
        <TextList fields={wanted} data={boat} />
      </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" href={'/boats/'+boat.oga_no} >Learn More</Button>
      </CardActions>
    </Card>
  );
}
