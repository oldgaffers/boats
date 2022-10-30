import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from "@apollo/react-testing";
import BoatCards from './boatcards';

const mocks = [];

test('renders learn react link', () => {
  const { getByText } = render(
      <MockedProvider mocks={mocks}>
        <BoatCards location={{}} state={{filters:{}}} />
      </MockedProvider>
    );
  const wanted = getByText(/Loading/);
  expect(wanted).toBeInTheDocument();
});
