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
  rig_type: [],
  sail_type: [],
  design_class: [],
  generic_type: [],
  construction_material: [],
  construction_method: [],
  hull_form: [],
  spar_material: [],
};

vi.setSystemTime(1434319925275);

vi.mock('../util/api', () => {
  return {
    getPicklists: async () => pickers,
  };
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const default_test_schema = (pickers) => {
  return {
    "fields": [
      {
        "component": "wizard",
        "name": "edit",
        "fields": [
          {
            "title": "step1",
            "name": "step-1",
            "nextStep": "step-2",
            "fields": [
              {
                "component": "plain-text",
                "name": "basic",
                "type": "text",
                "label": "Basic Details"
              }
            ]
          },
          {
            "title": "step2",
            "name": "step-2",
            "nextStep": "step-3",
            "fields": [
              {
                "component": "plain-text",
                "name": "sd",
                "type": "text",
                "label": "Short Description"
              },
              {
                "component": "plain-text",
                "name": "fd",
                "type": "text",
                "label": "Full Description"
              }
            ]
          },
          {
            "title": "step3",
            "name": "step-3",
            "nextStep": "step-4",
            "fields": [
              {
                "component": "plain-text",
                "name": "build",
                "type": "text",
                "label": "Build"
              }
            ]
          }, {
            "title": "step4",
            "name": "step-4",
            "nextStep": "step-5",
            "fields": [
              {
                "component": "plain-text",
                "name": "design",
                "type": "text",
                "label": "Design"
              }
            ]
          }, {
            "title": "step5",
            "name": "step-5",
            "nextStep": "step-6",
            "fields": [
              {
                "component": "plain-text",
                "name": "references",
                "type": "text",
                "label": "References"
              }
            ]
          }, {
            "title": "step6",
            "name": "step-6",
            "nextStep": "step-7",
            "fields": [
              {
                "component": "plain-text",
                "name": "previous_names",
                "type": "text",
                "label": "Previous names"
              }
            ]
          }, {
            "title": "step7",
            "name": "step-7",
            "nextStep": "step-8",
            "fields": [
              {
                "component": "plain-text",
                "name": "locations",
                "type": "text",
                "label": "Locations"
              }
            ]
          },
          {
            "title": "step8",
            "name": "step-8",
            "nextStep": "step-9",
            "fields": [
              {
                "component": "plain-text",
                "name": "registrations",
                "type": "text",
                "label": "Registrations"
              }
            ]
          },
          {
            "title": "step9",
            "name": "step-9",
            "nextStep": "step-10",
            "fields": [
              {
                "component": "plain-text",
                "name": "construction",
                "type": "text",
                "label": "Construction"
              }
            ]
          },
          {
            "title": "step10",
            "name": "step-10",
            "nextStep": "step-11",
            "fields": [
              {
                "component": "plain-text",
                "name": "hull_form",
                "type": "text",
                "label": "Hull Form"
              }
            ]
          },
          {
            "title": "step11",
            "name": "step-11",
            "nextStep": "step-12",
            "fields": [
              {
                "component": "plain-text",
                "name": "handicaps",
                "type": "text",
                "label": "Handicaps"
              },
              {
                component: 'radio',
                name: "ddf.skip-handicap",
                label: 'Get a Handicap',
                initialValue: "1",
                validate: [
                  {
                    type: 'required',
                  },
                ],
                options: [
                  {
                    label: "I want a handicap",
                    value: "1",
                  },
                  {
                    label: "I'll leave it for now",
                    value: "2",
                  },
                ],
              },
            ]
          },
          {
            "title": "step12",
            "name": "step-12",
            "nextStep": "step-13",
            "fields": [
              {
                "component": "plain-text",
                "name": "ownerships",
                "type": "text",
                "label": "Known Owners"
              }
            ]
          },
          {
            "title": "step13",
            "name": "step-13",
            "fields": [
              {
                "component": "plain-text",
                "name": "done",
                "type": "text",
                "label": "Done"
              }
            ]
          },
        ]
      }
    ]
  }
};

describe('EditBoatWizard component tests', async () => {
  test('render form with no permission to sell', async () => {
    const user = { email: 'a@b.com', 'https://oga.org.uk/id': 0 };
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user,
      logout: vi.fn(),
      loginWithRedirect: vi.fn(),
    });
    expect(default_test_schema).toBeDefined();
    const onSubmit = vi.fn();
    const screen = await render(<EditBoatWizard boat={boat} open={true} onSubmit={onSubmit} />);
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
    expect(default_test_schema).toBeDefined();
    const onSubmit = vi.fn();
    const screen = await render(<EditBoatWizard boat={boat} open={true} onSubmit={onSubmit}
    // schema={default_test_schema(pickers)} 
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