import React from 'react';
import { screen, render } from '@testing-library/react';
import BoatCard from './boatcard';
import { BrowserRouter as Router } from "react-router-dom";
import { useAxios } from 'use-axios-client';
jest.mock('use-axios-client')

test('renders learn react link', () => {
  useAxios.mockReturnValue({ data: {result:{pageContext:{ boat: {}}}} });
  render(
      <Router>
        <BoatCard 
        path='/'
        state={{filters:{}, view:{}}} 
        boat={{oga_no: 1, previous_names: []}}
        />
      </Router>
  );
  const wanted = screen.getByText(/More/);
  expect(wanted).toBeInTheDocument();
});