import { expect, test, vi } from 'vitest';
import { screen, render } from 'vitest-browser-react';
import SearchAndFilterBoats from '../../components/searchandfilterboats';
import { mockPicks } from '../../../mock/sampledata';

vi.useFakeTimers();

test('renders learn react link', () => {
  render(
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
  const wanted = screen.getAllByText(/sort the list/);
  expect(wanted[0]).toBeInTheDocument();
});
