import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from "@apollo/react-testing";
import { MemoryRouter } from "react-router";
import gql from 'graphql-tag';
import Boat from './boat';

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
      <MemoryRouter initialEntries={["/boat/315"]}>
        <Boat />
      </MemoryRouter>
    </MockedProvider>
  );
  const wanted = getByText(/Loading/);
  expect(wanted).toBeInTheDocument();
});
