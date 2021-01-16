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
    return gql(q);
  }
  
  export function buildWhere(filters) {
    if (!filters) {
      return { _and: true }
    }
    const all = [];
    if (filters.firstYear) {
      all.push({ year: { _gte: filters.firstYear } });
    }
    if (filters.lastYear) {
        all.push({ year: { _lte: filters.lastYear } });
    }
    if (filters.oga_no) {
      all.push({ oga_no: { _eq: filters.oga_no } });
    }
    if (filters.name) {
      all.push({
        _or: [
          { name: { _ilike: `%${filters.name}%` } },
          { previous_names: { _contains: filters.name } },
        ],
      });
    }
    if (filters.designer) {
      all.push({
        designerByDesigner: { name: { _eq: filters.designer } },
      });
    }
    if (filters.builder) {
      all.push({
        builderByBuilder: { name: { _eq: filters.builder } },
      });
    }
    if (filters.rig_type) {
      all.push({ rigTypeByRigType: { name: { _eq: filters.rig_type } } });
    }
    if (filters.mainsail_type) {
      all.push({ mainsail_type: { _eq: filters.mainsail_type } });
      }
    if (filters.generic_type) {
      all.push({
        genericTypeByGenericType: { name: { _eq: filters.generic_type } },
      });
    }
    if (filters.design_class) {
      all.push({
        designClassByDesignClass: { name: { _eq: filters.design_class } },
      });
    }
    if (filters.construction_material) {
      all.push({
        constructionMaterialByConstructionMaterial: {
          name: { _eq: filters.construction_material },
        },
      });
    }
    if (filters.sale) {
      all.push({ for_sale_state: { text: { _eq: 'for_sale' } } });
    }
    return { _and: all };
  }  