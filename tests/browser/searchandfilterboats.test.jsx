import React from 'react';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import SearchAndFilterBoats from '../../src/components/searchandfilterboats';
import { mockPicks } from '../mock/sampledata';

vi.useFakeTimers();

test('renders learn react link', async () => {
  const { getByText } = await render(
      <SearchAndFilterBoats 
      sortDirection="asc"
      sortField="rank"
      boatsPerPage="12"
      filters={{sale: false}} pickers={mockPicks}
      onFilterChange={(x)=> console.log(x)} 
      onPageSizeChange={(x)=> console.log(x)} 
      onSortChange={(x,y)=> console.log(x,y)}      
      />
  );
  const wanted = getByText(/Boat Name/);
  expect(wanted).toBeInTheDocument();
});
