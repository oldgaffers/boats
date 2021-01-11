import React from "react"
import { Link } from 'gatsby';
import GqlBoatBrowser from '../../../components/GqlBoatBrowser';
import OGAProvider from '../../../util/gql';
import { getState } from '../../../util/gr';

const defaultState = {
  page: 1,
  boatsPerPage: '12', 
  sortField: 'editors_choice', 
  sortDirection: 'asc',
  filters: { sale: false }, 
};

export default function BrowseTheRegisterPage({ location }) {
  const state = getState(defaultState, location.search);
  // window.location.search = '';  
  return (
    <OGAProvider>
      <GqlBoatBrowser title="Browse the Register" defaultState={state} link={Link}/>
    </OGAProvider>
  );
}