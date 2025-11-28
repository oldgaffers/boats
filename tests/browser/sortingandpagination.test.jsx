import React from 'react';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import Uut from '../../src/components/sortingandpagination';

vi.useFakeTimers();

test('renders learn react link', async () => {
  const page = await render(
      <Uut 
      sortDirection="asc"
      sortField="rank"
      boatsPerPage="12"
      onPageSizeChange={(x)=> console.log(x)} 
      onSortChange={(x,y)=> console.log(x,y)}      
      />
  );
  const wanted = page.getByText('Sort Direction');
  expect(wanted).toBeInTheDocument();
});
