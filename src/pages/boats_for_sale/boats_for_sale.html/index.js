import React from "react"
import { Link } from 'gatsby';
import GqlBoatBrowser from '../../../components/GqlBoatBrowser';
import OGAProvider from '../../../util/gql';
import { getState } from '../../../util/gr';

const defaultState = {
  page: 1,
  boatsPerPage: '12', 
  sortField: 'price', 
  sortDirection: 'desc',
  filters: { sale: true }, 
};

export default function BrowseTheRegisterPage({location}) {  
  const state = getState(defaultState, location.search);
  return (
    <OGAProvider>
      <GqlBoatBrowser title='Boats for Sale' defaultState={state} link={Link} />
    </OGAProvider>
  );
}