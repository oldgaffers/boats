import React from 'react';
import { screen, render } from '@testing-library/react';
import BoatCard from './boatcard';
import { BrowserRouter as Router } from "react-router-dom";
import { useAxios } from 'use-axios-client';
import { MockedProvider } from '@apollo/react-testing';
jest.mock('use-axios-client')

test('renders learn react link', () => {
  useAxios.mockReturnValue({ data: { result: { pageContext: { boat: {} } } } });
  render(
    <Router>
      <MockedProvider>
        <BoatCard
          path='/'
          state={{ filters: {}, view: {} }}
          boat={{ oga_no: 1, previous_names: [] }}
        />
      </MockedProvider>
    </Router>
  );
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});