import React from 'react';
import { MemoryRouter } from "react-router-dom";
import { screen, render } from '@testing-library/react';
import Boat from './boat';

test('renders learn react link', () => {
  render(
    <MemoryRouter initialEntries={['/', '/?oga_no=1']} initialIndex={1} >
      <Boat/>
    </MemoryRouter>
  );
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});
