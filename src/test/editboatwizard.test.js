 import fs from "fs";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import EditBoatWizard from '../components/editboatwizard';
import '../util/api';
import * as MockDate from 'mockdate';
import { MockedProvider } from "@apollo/client/testing";
import { MEMBER_QUERY } from "../util/ownernames";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();


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

MockDate.set(1434319925275);

jest.mock('../util/api', () => {
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

const mocks = [
  {
    request: {
      query: MEMBER_QUERY,
      variables: {
        members: [6610]
      }
    },
    result: {
      data: {
        member: { id: "1", name: "Buck" }
      }
    }
  }
];

describe('EditBoatWizard component tests', () => {
  const { result: { pageContext: { boat } } } = JSON.parse(fs.readFileSync('./src/test/843.json', 'utf-8'));
  test('render form with no permission to sell', async () => {
    const user = userEvent.setup();
    expect(user).toBeDefined();
    expect(default_test_schema).toBeDefined();
    const onSubmit = jest.fn();
    render(
      <MockedProvider mocks={mocks}>
        <EditBoatWizard boat={boat} user={{ email: 'a@b.com', 'https://oga.org.uk/id': 0 }} open={true} onSubmit={onSubmit}
    // schema={default_test_schema(pickers)} 
    />
      </MockedProvider>
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    await waitFor(async () => {
      await screen.findByRole('dialog');
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    await waitFor(() => {
      screen.getAllByText('Rig');
    });
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Generic Type(s)');
    });
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getAllByText(/full description/i);
    });
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Build');
    });
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Design');
    });
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Basic Dimensions');
    });
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('References');
    });
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Previous names');
    });
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Locations');
    });
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Registrations');
    });
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Construction');
    });
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Hull Form');
    });
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Handicaps');
    });
    fireEvent.click(screen.getByText('I\'ll leave it for now'));
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Known Owners');
    });
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Submit');
    });
    userEvent.click(screen.getByText('Submit'), { pointerEventsCheck: 0 });
    await sleep(400);
    expect(onSubmit).toBeCalled();
  });

    test('render form with permission to sell', async () => {
    const user = userEvent.setup();
    expect(user).toBeDefined();
    expect(default_test_schema).toBeDefined();
    const onSubmit = jest.fn();
    render(
      <MockedProvider mocks={mocks}>
        <EditBoatWizard boat={boat} user={{ email: 'a@b.com', 'https://oga.org.uk/id': 35034 }} open={true} onSubmit={onSubmit}
    // schema={default_test_schema(pickers)} 
    />
      </MockedProvider>
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    await waitFor(async () => {
      await screen.findByRole('dialog');
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    await waitFor(() => {
      screen.getAllByText('Rig');
    });
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Generic Type(s)');
    });
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getAllByText(/full description/i);
    });
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Build');
    });
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Design');
    });
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Basic Dimensions');
    });
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('References');
    });
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Previous names');
    });
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Locations');
    });
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Registrations');
    });
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Construction');
    });
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Hull Form');
    });
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Handicaps');
    });
    fireEvent.click(screen.getByText('I\'ll leave it for now'));
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Known Owners');
    });
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('I want to sell this boat');
    });
    // fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      screen.getByText('Submit');
    });
    userEvent.click(screen.getByText('Submit'), { pointerEventsCheck: 0 });
    await sleep(400);
    expect(onSubmit).toBeCalled();
  })

});