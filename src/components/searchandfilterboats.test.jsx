import {jest} from '@jest/globals';
import React from 'react';
import { screen, render } from '@testing-library/react';
import { MockedProvider } from "@apollo/react-testing";
import SearchAndFilterBoats from './searchandfilterboats';
import { mockPicks } from '../mock/sampledata';

jest.useFakeTimers();

test('renders learn react link', () => {
  render(
    <MockedProvider>
      <SearchAndFilterBoats 
      sortDirection="asc"
      sortField="rank"
      boatsPerPage="12"
      filters={{sale: false}} pickers={mockPicks}
      onFilterChange={(x)=>// console.log(x)} 
      onPageSizeChange={(x)=>// console.log(x)} 
      onSortChange={(x,y)=>// console.log(x,y)}      
      />
    </MockedProvider>
  );
  const wanted = screen.getAllByText(/sort the list/);
  expect(wanted[0]).toBeInTheDocument();
});
