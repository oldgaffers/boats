import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

export function getTotal(data) {
  return data?data.boatwithrank_aggregate.aggregate.totalCount:0;
}

export function getBoats(data) {
  return data?data.boatwithrank:[];
}

export const useCardQuery = (state) => {
  const { picklists, filters, p, bpp, sort, sortDirection } = state;
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
          where: buildWhere(filters, picklists),
          sort: {[sort]: sortDirection},
        },
      },
    );  
  }
  
  const fieldmap = {
    builder: 'builderByBuilder',
    designer: 'designerByDesigner',
    design_class: 'designClassByDesignClass',
    generic_type: 'genericTypeByGenericType',
    rig_type: 'rigTypeByRigType',
  };

  export function buildWhere(choices, view) {
    const filters = {...view, ...choices};
    const all = [];
    for (const key of Object.keys(filters)) {
      switch(key) {
        case 'firstYear':
          all.push({ year: { _gte: filters.firstYear } });
          break;
        case 'lastYear':
          all.push({ year: { _lte: filters.lastYear } });
          break;
        case 'name':
          all.push({
            _or: [
              { name: { _ilike: `%${filters.name}%` } },
              { previous_names: { _contains: filters.name } },
            ],
          });
          break;
        case 'for_sale':
          all.push({ for_sale_state: { text: { _eq: 'for_sale' } } });
          break;
        default:
          {
            const vals = filters[key];
            const condition = Array.isArray(vals)?{ _in: vals }:{ _eq: vals };
            if (fieldmap[key]) {
              all.push({ [fieldmap[key]]: { name: condition } });  
            } else {
              all.push({ [key]: condition });  
            }  
          }
      }
    }
    return { _and: all };
}
