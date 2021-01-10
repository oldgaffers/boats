import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import toggle from '../images/toggle.gif';
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

export default function BoatCards({
  boatsPerPage,
  sortField,
  sortDirection,
  filters,
  page,
  onChangePage,
}) {
  const classes = useStyles();
  const { loading, error, data } = useQuery(
    query(`{${sortField}: ${sortDirection}}`),
    {
      variables: {
        limit: boatsPerPage,
        offset: boatsPerPage * (page - 1),
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
              <BoatCard 
                filters={filters} boatsPerPage={`${boatsPerPage}`}
                sortField={sortField} sortDirection={sortDirection} 
                key={boat.oga_no} boat={boat} page={page}
              />
            </Grid>
          ))}
          </Grid>
          <Box py={1} ></Box>
          <BoatPagination items={pageItems} />
        </Container>
    );
  }
  return (
    <div className="CenterItem">
      <p>There are no boats which match the filter criteria you have set. Try
      broadening the criteria. For example, if you have 'include boats without pictures' disabled, try enabling it.
      </p>
        <img src={toggle} alt="there is a toggle pictures control"/>
    </div>
  );
}
