import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { query, buildWhere } from '../util/cardquery';
import { useBoatPagination } from '../util/BoatPagination';
import BoatPagination from './boatpagination';
import BoatCard from './boatcard';

const useStyles = makeStyles((theme) => ({
  CenterItem: {
    margin: 'auto'
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
}));

export default function BoatCards({ state, onChangePage, link }) {
  const { filters, page, boatsPerPage, sortField, sortDirection } = state;
  const classes = useStyles();
  const bpp = parseInt(boatsPerPage);
  const { loading, error, data } = useQuery(
    query(`{${sortField}: ${sortDirection}}`),
    {
      variables: {
        limit: bpp,
        offset: bpp * (page - 1),
        where: buildWhere(filters),
      },
    },
  );
  if (error) console.log(JSON.stringify(error));

  const totalCount = data?data.boat_aggregate.aggregate.totalCount:0; 
  const pages = Math.ceil(totalCount / boatsPerPage);

  const pageItems = useBoatPagination(
    pages,
    page,
    function(event, page) {
      onChangePage({ selectedBoats: totalCount, pages, page });
    }
  );

  if (error) return <p>Error: (BoatCards)</p>;

  if (loading) {
    if (data) {
      console.log('Loading set but data here');
    } else {
      return <p>Loading...</p>;
    }
  }

  if (totalCount > 0) {
    return (
      <Container className={classes.cardGrid} maxWidth="md">
        <BoatPagination items={pageItems} />
          <Box py={1} ></Box>
          <Grid container spacing={4}>
          {data.boat.map((boat) => (
            <Grid item key={boat.oga_no} xs={12} sm={6} md={4}>
              <BoatCard state={state} boat={boat} link={link} />
            </Grid>
          ))}
          </Grid>
          <Box py={1} ></Box>
          <BoatPagination items={pageItems} />
        </Container>
    );
  }

  const { 
    rig_type, construction_material, generic_type, 
    design_class, year, sale, mainsail_type,
    designer, builder, oga_no, name
  } = filters;
  let message;
  if (oga_no) {
    message = `The boat numbered ${oga_no} doesn't match the filters you have set`;
  } else {
    message = 'There are no';
    if (rig_type) {
      message = `${message} ${rig_type} rigged`;
    }
    if (design_class) {
      message = `${message} ${design_class}'s`;
    } else if (generic_type) {
      message = `${message} ${generic_type}'s`;
    } else {
      message = `${message} boats`;
    }
    if (mainsail_type) {
      message = `${message} with a ${mainsail_type} main`;
    }
    if (designer) {
      message = `${message} by this designer`;
    }
    if (builder) {
      message = `${message} by this builder`;
    }
    if (year) {
      const { firstYear, lastYear } = year;
      if (firstYear && lastYear) {
        message = `${message} built between ${firstYear} and ${lastYear}`;
      } else if (firstYear) {
        message = `${message} built after ${firstYear}`;
      } else if (lastYear) {
        message = `${message} built before ${lastYear}`;
      }
    }
    if (construction_material) {
      message = `${message} built of ${construction_material}`;
    }
    if (sale) {
      message = `${message} for sale.`;
    }
    message = `${message} on the register`;
    if (name) {
      message = `${message} which have ever been called ${name}`;
    }
  }


  return (
    <Grid container alignItems='stretch'>
    <Grid xs={2}></Grid>
      <Grid>
      <Typography variant='h6'>{message}.</Typography>
      <Typography variant='h6'>Try removing some filters.</Typography>
    </Grid>
    <Grid xs={2}></Grid>
  </Grid>);
}
