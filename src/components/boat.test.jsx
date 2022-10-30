import React from 'react';
import { MemoryRouter } from "react-router-dom";
import { render } from '@testing-library/react';
import Boat from './boat';

test('renders learn react link', () => {
  const { container } = render(
      <MemoryRouter initialEntries={['/', '/?oga_no=1']} initialIndex={1} >
        <Boat/>
      </MemoryRouter>
  );
  const progress = container.getElementsByClassName('MuiCircularProgress-circle');
  expect(progress.length).toBe(1);
});
