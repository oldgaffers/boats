import { gql, useQuery, useLazyQuery } from '@apollo/client';

const basicQuery = gql(`{
    boat{name previous_names}
    designer(order_by: {name: asc}){name id}
    builder(order_by: {name: asc}){name id}
    rig_type(order_by: {name: asc}){name}
    design_class(order_by: {name: asc}){name id}
    generic_type(order_by: {name: asc}){name}
    sail_type(order_by: {name: asc}){name}
    construction_material(order_by: {name: asc}){name}
    construction_method(order_by: {name: asc}){name}
    hull_form(order_by: {name: asc}){ name }
    spar_material(order_by: {name: asc}){ name }
}`);

const saleQuery = gql(`{
    boat(where: {for_sale_state: {text: {_eq: "for_sale"}}}) { name previous_names }
    designer(where: {boats: {for_sale_state: {text: {_eq: "for_sale"}}}}, order_by: {name: asc}) { id name }
    builder(where: {boats: {for_sale_state: {text: {_eq: "for_sale"}}}}, order_by: {name: asc}) { id name }
    design_class(where: {boats: {for_sale_state: {text: {_eq: "for_sale"}}}}, order_by: {name: asc}) { id name }
    rig_type(where: {boats: {for_sale_state: {text: {_eq: "for_sale"}}}}, order_by: {name: asc}) { name }
    generic_type(where: {boats: {for_sale_state: {text: {_eq: "for_sale"}}}}, order_by: {name: asc}) { name }
    sail_type(where: {boats: {for_sale_state: {text: {_eq: "for_sale"}}}}, order_by: {name: asc}) { name }
    construction_material(where: {boats: {for_sale_state: {text: {_eq: "for_sale"}}}}, order_by: {name: asc}) { name }
    construction_method(where: {boats: {for_sale_state: {text: {_eq: "for_sale"}}}}, order_by: {name: asc}) { name }
    hull_form(where: {boats: {for_sale_state: {text: {_eq: "for_sale"}}}}, order_by: {name: asc}) { name }
    spar_material(where: {boats: {for_sale_state: {text: {_eq: "for_sale"}}}}, order_by: {name: asc}) { name }
}`);

const smallQuery = gql(`{
    boat(where: {generic_type: {_in: ["Dayboat","Dinghy"]}}) { name previous_names }
    designer(order_by: {name: asc}, where: {boats: {generic_type: {_in: ["Dayboat", "Dinghy"]}}}) { id name }
    design_class(order_by: {name: asc}, where: {boats: {generic_type: {_in: ["Dayboat", "Dinghy"]}}}) { id name }
    builder(order_by: {name: asc}, where: {boats: {generic_type: {_in: ["Dayboat", "Dinghy"]}}}) { id name }
    rig_type(order_by: {name: asc}, where: {boats: {generic_type: {_in: ["Dayboat", "Dinghy"]}}}) { name }
    generic_type(order_by: {name: asc}, where: {boats: {generic_type: {_in: ["Dayboat", "Dinghy"]}}}) { name }
    sail_type(order_by: {name: asc}, where: {boats: {generic_type: {_in: ["Dayboat", "Dinghy"]}}}) { name }
    construction_material(order_by: {name: asc}, where: {boats: {generic_type: {_in: ["Dayboat", "Dinghy"]}}}) { name }
    construction_method(order_by: {name: asc}, where: {boats: {generic_type: {_in: ["Dayboat", "Dinghy"]}}}) { name }
    hull_form(order_by: {name: asc}, where: {boats: {generic_type: {_in: ["Dayboat", "Dinghy"]}}}) { name }
    spar_material(order_by: {name: asc}, where: {boats: {generic_type: {_in: ["Dayboat", "Dinghy"]}}}) { name }
}`);

export function usePicklists(view={}) {
    // for now we only support boats for sale and small boats
    let query = basicQuery;
    switch (view) {
        case 'small':
            // { "where":{"_and":[{"genericTypeByGenericType":{"name":{"_in":["Dinghy","Dayboat"]}}}]}
            console.log('small boats view');
            query = smallQuery;
            break;
        case 'sell':
            console.log('boats for sale view');
            query = saleQuery;
            break;
        default:
            console.log('main register');
    }
    return useQuery(query);
}

export function useLazyPicklists() {
    return useLazyQuery(basicQuery);
}
