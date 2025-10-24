import React from 'react';
import { screen, render } from '@testing-library/react';
import { MockedProvider } from "@apollo/client/testing";
import Boat from './boat';
import * as api from '../util/api';

jest.mock("../util/api", () => {
  return {
    getBoatData: () => Promise.resolve({ name: 'x' }),
    getPicklists: () => Promise.resolve({}),
  };
});

const mocks = [

];

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
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Boat ogaNo={0}/>
    </MockedProvider>
  );
  expect(screen.getAllByRole('link').length).toBe(4);

});
