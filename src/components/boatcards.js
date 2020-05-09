import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import BoatCard from './boatcard';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
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

export const query = (sort) => gql`
query boats($where: boat_bool_exp!, $limit: Int!, $offset: Int!) {
    boat_aggregate(where: $where) { aggregate { totalCount: count } }
    boat(limit: $limit, offset: $offset, order_by: ${sort}, where: $where) {
      id name
      oga_no
      place_built
      previous_names
      home_port
      short_description
      year
      builderByBuilder{name}
      designerByDesigner{name}
      design_class
      image_key
    }
  }`;

function BoatCards({
  boatsPerPage = 12,
  sortField = 'name',
  sortDirection = 'asc',
  where = {
    _and: [
      { year: { _gte: '1800' } },
      { year: { _lte: new Date().getFullYear() } },
      {image_key: { _is_null: false } } ,
    ],
  },
  onLoad = function(n) {
    console.log('boat cards loaded total is', n);
  },
}) {
  const classes = useStyles();

  const [page, setPage] = useState(1);
  const { loading, error, data } = useQuery(
    query(`{${sortField}: ${sortDirection}}`),
    {
      variables: {
        limit: boatsPerPage,
        offset: boatsPerPage * (page - 1),
        where: where,
      },
    },
  );
  if (error) return <p>Error: (BoatCards)</p>;

  if (loading) {
    if (data) {
      console.log('Loading set but data here');
    } else {
      return <p>Loading...</p>;
    }
  }

  const totalCount = data?data.boat_aggregate.aggregate.totalCount:0; // should only happen in test

  if (onLoad) {
    onLoad(totalCount);
  }

  const pages = Math.ceil(totalCount / boatsPerPage);

  function handlePageChange(event, page) {
    setPage(page);
  }

  if (totalCount > 0) {
    return (
    <React.Fragment>
      <CssBaseline />
      <main>
      <Container className={classes.cardGrid} maxWidth="md">
        <Pagination
            count={pages}
            variant="outlined"
            shape="rounded"
            onChange={handlePageChange}
          />
          <Grid container spacing={4}>

          {data.boat.map((boat) => (
            <Grid item key={boat.oga_no} xs={12} sm={6} md={4}>
              <BoatCard key={boat.oga_no} boat={boat} classes={classes} />
            </Grid>
          ))}
          </Grid>
          <Pagination
          count={pages}
          variant="outlined"
          shape="rounded"
          onChange={handlePageChange}
        />
        </Container>
      </main>
      </React.Fragment>
    );
  }
  return (
    <p>
      There are no boats which match the filter criteria you have set. Try
      broadening the criteria.
    </p>
  );
}

export default BoatCards;
