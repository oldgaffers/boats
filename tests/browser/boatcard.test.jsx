import React from 'react';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import BoatCard from '../../src/components/boatcard';

test('renders learn react link', async () => {
	const screen = await render(
		<BoatCard
			path='/'
			state={{ filters: {}, view: {} }}
			boat={{ oga_no: 1, previous_names: [] }}
		/>
	);
	expect(screen.getByRole('progressbar')).toBeInTheDocument();
});
