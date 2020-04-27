import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from "@apollo/react-testing";
import gql from 'graphql-tag';
import BoatCard from './boatcard';

const mocks = [
  {
    request: {
      query: gql`query{thumb(id:$id)}`,
      variables: { id: 1 }
    },
    result: {
      data: {
        thumb: "https://thumbs.com/1.jpg"
      }
    }
  },
  {
    request: {
      query: gql`query{thumb(id:$id)}`,
      variables: { id: 1}
    },
    error: new Error("Something went wrong")
  }
];

test('renders learn react link', () => {
  const { getByText } = render(
      <MockedProvider mocks={mocks}>
        <BoatCard boat={{oga_no: 1, previous_names: []}} />
      </MockedProvider>
  );
  const wanted = getByText(/Learn More/);
  expect(wanted).toBeInTheDocument();
});
