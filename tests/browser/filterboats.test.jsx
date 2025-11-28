import React from 'react';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import Uut from '../../src/components/filterboats';
import { mockPicks } from '../mock/sampledata';

vi.useFakeTimers();

test('renders learn react link', async () => {
  const page = await render(
    <Uut
      filters={{ sale: false }} pickers={mockPicks}
      onFilterChange={(x) => console.log(x)}
      onPageSizeChange={(x) => console.log(x)}
      onSortChange={(x, y) => console.log(x, y)}
    />
  );
  const wanted = page.getByLabelText('Boat Name');
  expect(wanted).toBeInTheDocument();
});
