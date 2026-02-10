import React from 'react';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import Uut from '../../src/components/filterboats';
import { mockPicks } from '../mock/sampledata';

vi.useFakeTimers();
test('renders expected controls and disabled states', async () => {
  const page = await render(
    <Uut
      filters={{ sale: false }} pickers={mockPicks}
      onFilterChange={(x) => console.log(x)}
      onPageSizeChange={(x) => console.log(x)}
      onSortChange={(x, y) => console.log(x, y)}
    />
  );

  expect(page.getByLabelText('Boat Name')).toBeInTheDocument();
  expect(page.getByLabelText('OGA Boat No.')).toBeInTheDocument();

  // Clear Marks should be disabled when there are no marks
  const clearBtn = page.getByText('Clear Marks');
  expect(clearBtn).toBeDisabled();

  // Only Marked Boats switch should be present and disabled
  const onlyMarked = page.getByLabelText('Only Marked Boats');
  expect(onlyMarked).toBeDisabled();

  // Date range label uses pickers.year from sampledata
  expect(page.getByText('Built Between: 2021 and 2022')).toBeInTheDocument();
});

test('renders other pickers like Designer and Builder', async () => {
  const page = await render(
    <Uut
      filters={{ sale: false }} pickers={mockPicks}
      onFilterChange={(x) => console.log(x)}
      onPageSizeChange={(x) => console.log(x)}
      onSortChange={(x, y) => console.log(x, y)}
    />
  );

  expect(page.getByLabelText('Designer')).toBeInTheDocument();
  expect(page.getByLabelText('Builder')).toBeInTheDocument();
});
