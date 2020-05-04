import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from "@apollo/react-testing";
import gql from 'graphql-tag';
import SearchAndFilterBoats from './searchandfilterboats';
import { sampleBoatNames } from '../mock/sampledata';

const mocks = [
  {
    request: {
      query: gql`{
        boat{name previous_names}
        designer{name}
        builder{name}
        rig_type {name}
        sail_type{name}
        design_class {name}
        generic_type{name}
        construction_material{name}        
    }`,
      variables: { }
    },
    result: {
      data: {
        boat: sampleBoatNames
      }
    }
  },
];

test('renders learn react link', () => {
  const { getAllByText } = render(
    <MockedProvider mocks={mocks}>
      <SearchAndFilterBoats />
    </MockedProvider>
  );
  const wanted = getAllByText(/Loading.../);
  expect(wanted[0]).toBeInTheDocument();
});
