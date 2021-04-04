
const fieldmap = {
    builder: 'builderByBuilder',
    designer: 'designerByDesigner',
    design_class: 'designClassByDesignClass',
    generic_type: 'genericTypeByGenericType',
    rig_type: 'rigTypeByRigType',
};

export function singleConditionBuilder(key, filters) {
    switch(key) {
        case 'firstYear':
          return { year: { _gte: filters.firstYear } };
          break;
        case 'lastYear':
          return { year: { _lte: filters.lastYear } };
          break;
        case 'name':
          return {
            _or: [
              { name: { _ilike: `%${filters.name}%` } },
              { previous_names: { _contains: filters.name } },
            ],
          };
          break;
        case 'sale':
          return { for_sale_state: { text: { _eq: 'for_sale' } } };
          break;
        default:
          {
            const vals = filters[key];
            const condition = Array.isArray(vals)?{ _in: vals }:{ _eq: vals };
            if (fieldmap[key]) {
              return { [fieldmap[key]]: { name: condition } };  
            } else {
              return { [key]: condition };  
            }  
          }
      }
}

export function conditionBuilder(filters) {
    const all = [];
    for (const key of Object.keys(filters)) {
        all.push(singleConditionBuilder(key, filters));
    }    
    return { _and: all };
}