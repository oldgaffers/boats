import { screen, render, waitFor } from '@testing-library/react';
import { MockedProvider } from "@apollo/client/testing";
import Boat from './boat';
import { MEMBER_QUERY } from './boatwrapper';
import * as api from '../util/api';

jest.mock("../util/api", () => {
  return {
    getBoatData: () => Promise.resolve({ name: 'x' }),
    getPicklists: () => Promise.resolve({}),
  };
});

const mocks = [
  {
    request: {
      query: MEMBER_QUERY,
      variables: {
        name: "Buck"
      }
    },
    result: {
      data: {
        dog: { id: "1", name: "Buck", breed: "bulldog" }
      }
    }
  }
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
