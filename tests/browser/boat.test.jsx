import React from 'react';
import { test, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import Boat from '../../src/components/boat';
import { api_mocks } from '../mock/api';

vi.mock("../../src/util/api", () => api_mocks);

test('renders boat', async () => {
  const screen = await render(
    <Boat location={{ search: '?oga_no=1' }} ogaNo={1} />
  );
  expect(screen.getByRole('button').length).toBe(6);
});

test('renders missing ogano', async () => {
  const screen = await render(<Boat location={{ search: '?oga_no=0' }} ogaNo={0} />);
  expect(screen.getByRole('link').length).toBe(4);

});
