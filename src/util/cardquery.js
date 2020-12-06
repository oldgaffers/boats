import gql from 'graphql-tag';

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
  
  export function buildWhere(filters) {
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