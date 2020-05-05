import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import BoatCard from './boatcard';

const query = (sort) => gql`
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

  const totalCount = data.boat_aggregate.aggregate.totalCount;

  if (onLoad) {
    onLoad(totalCount);
  }

  const pages = Math.ceil(totalCount / boatsPerPage);

  function handlePageChange(event, page) {
    setPage(page);
  }

  if (totalCount > 0) {
    return (
      <div>
        <Pagination
          count={pages}
          variant="outlined"
          shape="rounded"
          onChange={handlePageChange}
        />
        <Grid container direction="row" justify="center" alignItems="center">
          {data.boat.map((boat) => (
            <BoatCard key={boat.oga_no} boat={boat} />
          ))}
          ;
        </Grid>
        <Pagination
          count={pages}
          variant="outlined"
          shape="rounded"
          onChange={handlePageChange}
        />
      </div>
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
