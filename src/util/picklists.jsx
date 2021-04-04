import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { singleConditionBuilder } from './gqlutils';

export function usePicklists(view={}) {
    // for now we only support boats for sale and small boats
    let where = undefined;
    let bwhere = undefined;
    if(view.generic_type) {
        bwhere = singleConditionBuilder('generic_type', view);
        where = {boats: bwhere};
    }
    if(view.sale) {
        bwhere = singleConditionBuilder('sale', view);
        where = {boats: bwhere};
    }
    if (where) {
        // can we have a generic _bool_exp?
        return useQuery(gql(`query lists(
            $w1: designer_bool_exp!
            $w2: builder_bool_exp!
            $w3: rig_type_bool_exp!
            $w4: design_class_bool_exp!
            $w5: generic_type_bool_exp!
            $w6: sail_type_bool_exp!
            $w7: construction_material_bool_exp!
            $w8: construction_method_bool_exp!
            $w9: hull_form_bool_exp!
            $wa: boat_bool_exp!
        )
        {
            boat(where: $wa){name previous_names}
            designer(order_by: {name: asc}, where: $w1){name id}
            builder(order_by: {name: asc}, where: $w2){name id}
            rig_type(order_by: {name: asc}, where: $w3){name}
            design_class(order_by: {name: asc}, where: $w4){name id}
            generic_type(order_by: {name: asc}, where: $w5){name}
            sail_type(order_by: {name: asc}, where: $w6){name}
            construction_material(order_by: {name: asc}, where: $w7){name}
            construction_method(order_by: {name: asc}, where: $w8){name}
            hull_form(order_by: {name: asc}, where: $w9){ name }
        }`),
        { variables: {
            w1: where, w2: where, w3: where, w4: where, w5: where,
            w6: where, w7: where, w8: where, w9: where, wa: bwhere,
        } }
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
