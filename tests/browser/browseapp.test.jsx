import React from 'react';
import { render } from 'vitest-browser-react';
import { test, expect, vi } from 'vitest';
import BrowseApp from '../../src/components/browseapp';

// Mock BrowseBoats so BrowseApp can be tested in isolation
vi.mock('../../src/components/browseboats', () => ({
  default: (props) => <div data-testid="browseboats-mock">BrowseBoats</div>,
}));

test('BrowseApp renders BrowseBoats child component', async () => {
  const screen = await render(<BrowseApp view="app" />);
  expect(screen.getByTestId('browseboats-mock')).toBeInTheDocument();
});
