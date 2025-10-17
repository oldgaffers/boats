import { BrowserRouter as Router } from "react-router-dom";
import { screen, render } from '@testing-library/react';
import BrowseBoats from './browseboats';

test('renders learn react link', () => {
  render(
      <Router>
        <BrowseBoats path='/' state={{filters:{ sale: false },view:{}}} />
      </Router>
  );
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
  // const wanted = screen.getByText(/Other great places to look for boats are/);
  // expect(wanted).toBeInTheDocument();
});
