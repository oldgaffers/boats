import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { screen, render } from '@testing-library/react';
import BrowseBoats from './browseboats';
// import { MemoryRouter } from "react-router";
import { mockPicks } from '../mock/sampledata';

test('renders learn react link', () => {
  render(
      <Router>
        <BrowseBoats path='/' state={{filters:{ sale: false },view:{}}} pickers={mockPicks}/>
      </Router>
  );
  const wanted = screen.getByText(/Other great places to look for boats are/);
  expect(wanted).toBeInTheDocument();
});
