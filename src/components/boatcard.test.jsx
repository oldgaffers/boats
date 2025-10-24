import React from 'react';
import { screen, render } from '@testing-library/react';
import BoatCard from './boatcard';
import { BrowserRouter as Router } from "react-router-dom";

test('renders learn react link', () => {
  render(
    <Router>
      <BoatCard
        path='/'
        state={{ filters: {}, view: {} }}
        boat={{ oga_no: 1, previous_names: [] }}
      />
    </Router>
  );
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});