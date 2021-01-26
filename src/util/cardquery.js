import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { conditionBuilder } from './gqlutils';

export function getTotal(data) {
  return data?data.boatwithrank_aggregate.aggregate.totalCount:0;
}

export function getBoats(data) {
  return data?data.boatwithrank:[];
}

export const useCardQuery = (state) => {
  const { view, filters, p, bpp, sort, sortDirection } = state;
  const ibpp = parseInt(bpp);
  const ip = parseInt(p);
  return useQuery(
    gql`query boats(
      $sort: boatwithrank_order_by!,
      $where: boatwithrank_bool_exp!, 
      $limit: Int!, 
      $offset: Int!) {
        boatwithrank_aggregate(where: $where) {
          aggregate { totalCount: count __typename } __typename  }
        boatwithrank(
          limit: $limit, 
          offset: $offset, 
          order_by: [$sort], 
          where: $where
        ) {
          name oga_no place_built previous_names home_port short_description year
          builderByBuilder { name __typename }
          designerByDesigner { name __typename }
          design_class thumb image_key price
          for_sale_state { text __typename } 
          __typename
        }
      }`, 
      {
        variables: {
          limit: ibpp,
          offset: ibpp * (ip - 1),
          where: buildWhere(filters, view),
          sort: {[sort]: sortDirection},
        },
      },
    );  
}
  
export function buildWhere(choices, view) {
  return conditionBuilder({...view, ...choices});
}
