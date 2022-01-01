import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { conditionBuilder } from './gqlutils';

export function getTotal(data) {
  return data?data.boatwithrank_aggregate.aggregate.totalCount:0;
}

export function getBoats(data) {
  return data?data.boatwithrank:[];
}

export const query = gql`query boats(
  $order_by: [boatwithrank_order_by!],
  $where: boatwithrank_bool_exp!, 
  $limit: Int!, 
  $offset: Int!) {
    boatwithrank_aggregate(where: $where) {
      aggregate { totalCount: count __typename } __typename  }
    boatwithrank(
      limit: $limit, 
      offset: $offset, 
      order_by: $order_by, 
      where: $where
    ) {
      name oga_no place_built previous_names home_port short_description year
      builderByBuilder { name __typename }
      designerByDesigner { name __typename }
      design_class thumb image_key price
      for_sale_state { text __typename } 
      __typename
    }
  }`;

export const useCardQuery = (state) => {
  const { view, filters, page, bpp, sort, sortDirection } = state;
  return useQuery(
    query, 
      {
        variables: {
          limit: bpp,
          offset: bpp * (page - 1),
          where: buildWhere(filters),
          order_by: buildSort(sort, sortDirection),
        },
      },
    );  
}

// some sorts (e.g. length, updated_at) are unstable 
// unless augmented with a unique sort key
export function buildSort(sort, sortDirection) {
  if (sort === 'oga_no') {
    return { oga_no: sortDirection };
  }
  const dir = `${sortDirection}_nulls_last`;
  return [{[sort]: dir}, {oga_no: dir}];
}

export function buildWhere(choices) {
  return conditionBuilder({...choices});
}
