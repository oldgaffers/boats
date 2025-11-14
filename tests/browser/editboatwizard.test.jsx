import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render } from "vitest-browser-react";
import { userEvent } from 'vitest/browser'
import { useAuth0 } from '@auth0/auth0-react';
import '../../src/util/api';
import EditBoatWizard from '../../src/components/editboatwizard';
import { result } from '../mock/843.json';

vi.mock('@auth0/auth0-react');

const { boat } = result.pageContext;
const { waitFor } = vi;

const pickers = {
  boatNames: [],
  designer: [],
  builder: [],
  rig_type: ['Cutter'],
  sail_type: ['gaff'],
  design_class: [],
  generic_type: [{name:'Yacht'}],
  construction_material: ['wood'],
  construction_method: ['carvel'],
  hull_form: [],
  spar_material: ['wood'],
};

vi.setSystemTime(1434319925275);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

vi.mock('../../src/util/api', () => {
  return {
    clearNewValues: () => Promise.resolve(vi.fn()),
    postNewValues: () => Promise.resolve(vi.fn()),
    getPicklist: async (name) => pickers[name] || [],
    getPicklists: async () => pickers,
    nextOgaNo: async () => Promise.resolve(vi.fn()),
    openPr: async () => {
      await sleep(50); // give time for progress bar to render
      return Promise.resolve(false);
    },
  };
});

describe('EditBoatWizard component tests', async () => {
  test('render form with no permission to sell', async () => {
    const user = { email: 'a@b.com', 'https://oga.org.uk/id': 0 };
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user,
      logout: vi.fn(),
      loginWithRedirect: vi.fn(),
    });
    const onSubmit = vi.fn();
    const screen = await render(<EditBoatWizard boat={boat} open={true} onSubmit={onSubmit} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    await expect.element(screen.getByRole('dialog')).toBeInTheDocument();
    await waitFor(() => screen.getByText('Rig'));
    await waitFor(() => screen.getByText('Continue'));
    await userEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Generic Type(s)');
    });
    await userEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText(/full description/i);
    });
    await userEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Build');
    });
    await userEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Design');
    });
    await userEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Basic Dimensions');
    });
    await userEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('References');
    });
    await userEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Previous names');
    });
    await userEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Locations');
    });
    await userEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Registrations');
    });
    await userEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Construction');
    });
    await userEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Hull Form');
    });
    await userEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Handicaps');
    });
    await userEvent.click(screen.getByText('I\'ll leave it for now'));
    await userEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Known Owners');
    });
    await userEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Submit');
    });
    await userEvent.click(screen.getByText('Submit'), { pointerEventsCheck: 0 });
    await sleep(400);
    expect(onSubmit).toBeCalled();
  });

    test('render form with permission to sell', async () => {

// Mock the Auth0 hook and make it return a logged in state
    const user = { email: 'a@b.com', 'https://oga.org.uk/id': 35034 };
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user,
      logout: vi.fn(),
      loginWithRedirect: vi.fn(),
    });
    const onSubmit = vi.fn();
    const screen = await render(<EditBoatWizard boat={boat} open={true} onSubmit={onSubmit}
    />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    await expect.element(screen.getByRole('dialog')).toBeInTheDocument();
    await waitFor(() => {
      screen.getByText('Rig');
    });
    await userEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Generic Type(s)');
    });
    await userEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText(/full description/i);
    });
    await userEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Build');
    });
    await userEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Design');
    });
    await userEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Basic Dimensions');
    });
    await userEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('References');
    });
    await userEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Previous names');
    });
    await userEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Locations');
    });
    await userEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Registrations');
    });
    await userEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Construction');
    });
    await userEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Hull Form');
    });
    await userEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Handicaps');
    });
    await userEvent.click(screen.getByText('I\'ll leave it for now'));
    await userEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Known Owners');
    });
    await userEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('I want to sell this boat');
    });
    // await userEvent.click(screen.getByRole('checkbox'));
    await userEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Submit');
    });
    await userEvent.click(screen.getByText('Submit'), { pointerEventsCheck: 0 });
    await sleep(400);
    expect(onSubmit).toBeCalled();
  })

});