import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import Grid from '@material-ui/core/Grid';
import { usePagination } from '@material-ui/lab/Pagination';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import BoatCard from './boatcard';
import { makeStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';
// import Icon from '@material-ui/core/Icon';
import toggle from '../images/toggle.gif';

const useStyles = makeStyles((theme) => ({
  CenterItem: {
    margin: 'auto'
  },
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
  ul: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
  },
  buttonSelected: {
     fontWeight: 'bold'
  }
}));

function useBoatPagination( count, page, onChange ) {
  const { items } = usePagination({ count, page, onChange });
  const a = items.findIndex((cur) => cur.type === "start-ellipsis");
  if (a>=0) {
    const firstHalf = Math.floor(items[a+1].page / 2);
    items.splice(a, 0, {
      disabled: false,
      onClick: undefined,
      page: null,
      selected: false,
      type: 'other-ellipsis'
    },
    {
      disabled: false,
      onClick: (event) => onChange(event, firstHalf),
      page: firstHalf,
      selected: false,
      type: 'page'
    });
  }
  const b = items.findIndex((cur) => cur.type === "end-ellipsis");
  if (b>=0) {
    const lastHalf = items[b-1].page + Math.floor((count - items[b-1].page) / 2);
    items.splice(b+1, 0, {
      disabled: false,
      onClick: (event) => onChange(event, lastHalf),
      page: lastHalf,
      selected: false,
      type: 'page'
    },
    {
      disabled: false,
      onClick: undefined,
      page: null,
      selected: false,
      type: 'other-ellipsis'
    });
  }
  console.log('BoatPagination', items);
  return items;
}

function BoatPagination({items}) {
  const classes = useStyles();
  return (
    <nav>
      <ul className={classes.ul}>
        {items.map(({ page, type, selected, ...item }, index) => {
          let children = null;
          switch (type) {
            case 'other-ellipsis':
            case 'start-ellipsis':
            case 'end-ellipsis':
              children = '…';
            break;
            case 'page':
              children = (
              <button type="button" {...item} className={selected?classes.buttonSelected:undefined}>
                {page}
              </button>
            );
            break;
            case 'fast-forward':
                // children = (<Icon component="button" {...item} >fast_forward</Icon>);
              break;
              case 'fast-rewind':
                // children = (<Icon component="button" {...item} >fast_rewind</Icon>);
              break;
            default:
              children = (
              <button type="button" {...item}>
                {type}
              </button>
            );
          }
          return <li key={index}>{children}</li>;
        })}
      </ul>
    </nav>
  );
}

export const query = (sort) => {
  const q = `
query boats($where: boat_bool_exp!, $limit: Int!, $offset: Int!) {
    boat_aggregate(where: $where) { aggregate { totalCount: count } }
    boat(limit: $limit, offset: $offset, order_by: ${sort}, where: $where) {
      name oga_no
      place_built previous_names home_port
      short_description year
      builderByBuilder{name}
      designerByDesigner{name}
      design_class
      thumb image_key
      price
      for_sale_state { text }
    }
  }`
  // console.log(q);
  return gql(q);
}

function buildWhere(filters) {
  if (!filters) {
    return { _and: true }
  }
  const all = [];
  if (filters.year) {
    all.push({ year: { _gte: filters.year.firstYear } });
    all.push({ year: { _lte: filters.year.lastYear } });
  }
  if (filters.ogaNo) {
    all.push({ oga_no: { _eq: filters.ogaNo } });
  }
  if (filters['boat-name']) {
    all.push({
      _or: [
        { name: { _ilike: `${filters['boat-name']}%` } },
        { previous_names: { _contains: filters['boat-name'] } },
      ],
    });
  }
  if (filters['designer-name']) {
    all.push({
      designerByDesigner: { name: { _eq: filters['designer-name'] } },
    });
  }
  if (filters['builder-name']) {
    all.push({
      builderByBuilder: { name: { _eq: filters['builder-name'] } },
    });
  }
  if (filters['rig-type']) {
    all.push({ rigTypeByRigType: { name: { _eq: filters['rig-type'] } } });
  }
  if (filters['mainsail-type']) {
    all.push({ sail_type: { name: { _eq: filters['mainsail-type'] } } });
  }
  if (filters['generic-type']) {
    all.push({
      genericTypeByGenericType: { name: { _eq: filters['generic-type'] } },
    });
  }
  if (filters['design-class']) {
    all.push({
      designClassByDesignClass: { name: { _eq: filters['design-class'] } },
    });
  }
  if (filters['construction-material']) {
    all.push({
      constructionMaterialByConstructionMaterial: {
        name: { _eq: filters['construction-material'] },
      },
    });
  }
  if (!filters['nopics']) {
    all.push({ image_key: { _is_null: false } });
  }
  if (filters['sale']) {
    all.push({ for_sale_state: { text: { _eq: 'for_sale' } } });
  }
  return { _and: all };
}

function BoatCards({
  boatsPerPage,
  sortField,
  sortDirection,
  filters,
  onLoad = function(n) {
    console.log('boat cards loaded total is', n);
  },
}) {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  // console.log('BoatCards', sortField, sortDirection);
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

  const totalCount = data?data.boat_aggregate.aggregate.totalCount:0; // should only happen in test

  if (onLoad) {
    onLoad(totalCount);
  }

  const pageItems = useBoatPagination(
    Math.ceil(totalCount / boatsPerPage),
    page,
    function(event, p) {
      console.log('handlePageChange', event, p);
      setPage(page);
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
                key={boat.oga_no} boat={boat} classes={classes}
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

export default BoatCards;
