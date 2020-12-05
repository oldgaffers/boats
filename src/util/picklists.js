import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export function usePicklists() {
    return useQuery(gql(`{
        boat{name previous_names}
        designer(order_by: {name: asc}){name}
        builder(order_by: {name: asc}){name}
        rig_type(order_by: {name: asc}){name}
        sail_type(order_by: {name: asc}){name}
        design_class(order_by: {name: asc}){name}
        generic_type(order_by: {name: asc}){name}
        construction_material(order_by: {name: asc}){name}
    }`));
}