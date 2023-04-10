import React from 'react';
import { screen, render } from '@testing-library/react';
import Boat from './boat';


test('renders back link', () => {
  render(
      <Boat location={{ search: '' }}/>
  );
  expect(screen.getByRole('link')).toBeInTheDocument();
});

test('renders progress bar', () => {
  render(
      <Boat location={{ search: '?oga_no=1' }}/>
  );
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});

test('renders progress bar too', () => {
  render(
      <Boat location={{ pathname: '/boat/1' }}/>
  );
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});
