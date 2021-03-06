import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from "@apollo/react-testing";
import gql from 'graphql-tag';
import BrowseBoats from './browseboats';
import { query } from '../util/cardquery';
import { MemoryRouter } from "react-router";
import { mockPicks } from '../mock/sampledata';

const mocks = [
  {
    request: {
      query: query({name: 'asc'}),
      variables: { 
        $limit: 1,
        $offset: 1,
        $where: {
        _and: [
            { year: { _gte: '1800' } },
            { year: { _lte: '2021' } },
            {image_key: { _is_null: false } } ,
          ],
        }
      }
    },
    result: {
      data: {
        boat_aggregate: { aggregate: { totalCount: 0 } }
      }
    }
  },
  {
    request: {
      query: gql`query{boats{id}}`,
      variables: { id: 1 }
    },
    result: {
      data: {
        boat_aggregate: { aggregate: { totalCount: 0 } }
      }
    }
  }
];

test('renders learn react link', () => {
  const { getByText } = render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter initialEntries={[{ pathname:'/', state: { filters: {}} }]}>
        <BrowseBoats state={{filters:{ sale: false }}} pickers={mockPicks}/>
      </MemoryRouter>
    </MockedProvider>
  );
  const wanted = getByText(/Other great places to look for boats are/);
  expect(wanted).toBeInTheDocument();
});
