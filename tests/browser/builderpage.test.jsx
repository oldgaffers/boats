import React from 'react';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import BuilderPage from '../../src/components/builderpage';
import { api_mocks } from '../mock/api';

vi.mock("../../src/util/api", () => api_mocks);

test('renders learn react link', async () => {
	const screen = await render(
		<BuilderPage
            name='Test Yard'
            place='Woodbridge'
		/>
	);
	expect(screen).toBeDefined();
});
