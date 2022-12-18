import React from 'react';
import { screen, render } from '@testing-library/react';
import BoatCard from './boatcard';
import { BrowserRouter as Router } from "react-router-dom";
import { MockedProvider } from '@apollo/react-testing';

test('renders learn react link', () => {
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