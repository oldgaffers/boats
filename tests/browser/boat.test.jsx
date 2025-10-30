import React from 'react';
import { test, expect, vi } from 'vitest';
import { screen, render } from 'vitest-browser-react';
import Boat from './boat';
import * as api from '../util/api';

vi.mock("../util/api", () => {
  return {
    getBoatData: () => Promise.resolve({ name: 'x' }),
    getPicklists: () => Promise.resolve({}),
  };
});

/*
test('renders boat', async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Boat ogaNo={1}/>
    </MockedProvider>
  );
  await waitFor(() => {
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(5);
  });

});
*/
test('renders missing ogano', async () => {
  render(<Boat ogaNo={0}/>);
  expect(screen.getAllByRole('link').length).toBe(4);

});
