import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { singleConditionBuilder } from './gqlutils';

export function usePicklists(view={}) {
    // for now we only support boats for sale and small boats
    let where = undefined;
    if(view.generic_type) {
        where = {boats: singleConditionBuilder('generic_type', view)};
    }
    if(view.sale) {
        where = {boats: singleConditionBuilder('sale', view)};
    }
    if (where) {
        // can we have a generic _bool_exp?
        return useQuery(gql(`query lists(
            $w1: designer_bool_exp!
            $w2: builder_bool_exp!
            $w3: rig_type_bool_exp!
            $w4: design_class_bool_exp!
            $w5: generic_type_bool_exp!
        )
        {
            boat{name previous_names}
            designer(order_by: {name: asc}, where: $w1){name id}
            builder(order_by: {name: asc}, where: $w2){name id}
            rig_type(order_by: {name: asc}, where: $w3){name}
            design_class(order_by: {name: asc}, where: $w4){name id}
            generic_type(order_by: {name: asc}, where: $w5){name}
            sail_type(order_by: {name: asc}){name}
            construction_material(order_by: {name: asc}){name}
            construction_method(order_by: {name: asc}){name}
            hull_form(order_by: {name: asc}){ name }
            spar_material(order_by: {name: asc}){ name }
        }`),
        { variables: {w1: where, w2: where, w3: where, w4: where, w5: where } }
        );
    }
    return useQuery(gql(`{
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
    }`));
}
