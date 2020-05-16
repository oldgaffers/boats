import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import Grid from '@material-ui/core/Grid';
import { Pagination } from '@material-ui/lab';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import BoatCard from './boatcard';
import { makeStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';

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
      name oga_no image_key
      place_built previous_names home_port
      short_description year
      builderByBuilder{name}
      designerByDesigner{name}
      design_class thumb
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
      <Container className={classes.cardGrid} maxWidth="md">
        <Pagination 
            count={pages}
            variant="outlined"
            shape="rounded"
            onChange={handlePageChange}
          />
          <Box py={1} ></Box>
          <Grid container spacing={4}>
          {data.boat.map((boat) => (
            <Grid item key={boat.oga_no} xs={12} sm={6} md={4}>
              <BoatCard sortDirection={sortDirection} key={boat.oga_no} boat={boat} classes={classes} />
            </Grid>
          ))}
          </Grid>
          <Box py={1} ></Box>
          <Pagination
          count={pages}
          variant="outlined"
          shape="rounded"
          onChange={handlePageChange}
        />
        </Container>
    );
  }
  return (
    <p>
      There are no boats which match the filter criteria you have set. Try
      broadening the criteria. For example, if you have 'include boats without pictures' disabled, try enabling it.
    </p>
  );
}

export default BoatCards;
