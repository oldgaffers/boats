import React from 'react';
import { render } from '@testing-library/react';
import BoatCard from './boatcard';
import { BrowserRouter as Router } from "react-router-dom";
import useAxios from 'axios-hooks'
jest.mock('axios-hooks')

test('renders learn react link', () => {
  useAxios.mockReturnValue([
    {
      data: {result:{pageContext:{ boat: {}}}}
    }
  ]);
  const view = render(
      <Router>
        <BoatCard 
        path='/'
        state={{filters:{}, view:{}}} 
        boat={{oga_no: 1, previous_names: []}}
        />
      </Router>
  );
  const wanted = view.getByText(/More/);
  expect(wanted).toBeInTheDocument();
});