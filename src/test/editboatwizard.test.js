import fs from "fs";
import React from "react";
import { act, render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import EditBoatWizard from '../components/editboatwizard';
import '../components/boatregisterposts';
import {
  designerItems,
  builderItems,
  constructionItems,
  designClassItems,
} from "../components/ddf/util";
import { steps as handicap_steps } from "../components/Handicap";
import {
  yearItems,
  homeItems,
  registrationForm,
  referencesItems,
  salesSteps,
  ownerShipsFields,
  sellingDataFields,
  doneFields,
  hullFields,
  descriptionsItems,
  basicFields,
} from "../components/ddf/SubForms";

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

jest.mock('../components/boatregisterposts', () => {
  return {
    getPicklists: async () => pickers,
  };
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const test_schema = (pickers) => {
  return {
    "fields": [
      {
        "component": "wizard",
        "name": "edit",
        "fields": [
          {
            name: "basic-step",
            nextStep: "descriptions-step",
            fields: [
              {
                component: 'text-field',
                name: "ddf.can_sell",
                label: "can buy/sell",
                hideField: true,
              },
              {
                component: 'sub-form',
                name: "basic.form",
                title: "Basic Details",
                fields: basicFields(pickers),
              },
            ],
          },
          {
            "title": "step2",
            "name": "descriptions-step",
            "nextStep": "build-step",
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
            name: "build-step",
            nextStep: "design-step",
            fields: [
              {
                title: "Build",
                name: "build",
                component: 'sub-form',
                fields: [
                  ...yearItems,
                  {
                    component: 'text-field',
                    name: "place_built",
                    label: "Place Built",
                  },
                  ...builderItems(pickers),
                  {
                    component: 'text-field',
                    name: "hin",
                    label: "Hull Identification Number (HIN)",
                  },
                ],
              },
            ],
          },
          {
            name: "design-step",
            nextStep: "references-step",
            fields: [
              {
                title: "Design",
                name: "design",
                component: 'sub-form',
                fields: [
                  ...designerItems(pickers),
                  ...designClassItems(pickers),
                  {
                    component: 'text-field',
                    name: "handicap_data.length_on_deck",
                    label: "Length on deck (decimal feet)",
                    type: "number",
                    dataType: 'float',
                  },
                  {
                    component: 'text-field',
                    name: "handicap_data.beam",
                    label: "Beam (decimal feet)",
                    type: "number",
                    dataType: 'float',
                    isRequired: true,
                    validate: [
                      {
                        type: 'required',
                      },
                      /*{
                        type: 'min-number-value',
                        threshold: 1,
                      }*/
                    ],
                  },
                  {
                    component: 'text-field',
                    name: "handicap_data.draft",
                    label: "Minumum Draft (decimal feet)",
                    type: "number",
                    dataType: 'float',
                    isRequired: true,
                    validate: [
                      {
                        type: 'required',
                      },
                      /*{
                       type: 'min-number-value',
                       threshold: 1
                      }*/
                    ],
                  },
                  {
                    component: 'text-field',
                    name: "air_draft",
                    label: "Air Draft (decimal feet)",
                    type: "number",
                    dataType: 'float',
                    validate: [
                      /*{
                        type: 'min-number-value',
                        threshold: 1
                      }*/
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: "references-step",
            nextStep: "previousnames-step",
            fields: [
              {
                name: "references",
                title: "References",
                component: 'sub-form',
                fields: referencesItems,
              },
            ],
          },
          {
            name: "previousnames-step",
            nextStep: "locations-step",
            fields: [
              {
                label: "New name",
                component: 'text-field',
                name: "ddf.new_name",
                description: 'if you have changed the name, enter the new name here.'
              },
              {
                label: "Previous names",
                component: 'field-array',
                name: "previous_names",
                fields: [{ component: "text-field" }],
              },
            ],
          },
          {
            name: "locations-step",
            nextStep: "registrations-step",
            fields: [
              {
                title: "Locations",
                name: "locations",
                component: 'sub-form',
                fields: homeItems,
              },
            ],
          },
          {
            name: "registrations-step",
            nextStep: "construction-step",
            fields: [registrationForm],
          },
          {
            "title": "step9",
            "name": "construction-step",
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

describe('EditBoatWizard component tests', () => {
  const { result: { pageContext: { boat } } } = JSON.parse(fs.readFileSync('./src/test/843.json', 'utf-8'));
  test('EditBoatWizard test rendering', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    act(() => {
      render(<EditBoatWizard boat={boat} user={{ email: 'a@b.com'}} open={true} onSubmit={onSubmit} 
      // schema={test_schema(pickers)} 
      />);
    });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    await waitFor(() => {
      screen.findByRole('dialog');
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    await waitFor(() => {
      screen.getByText('Basic Details');
    });
    act(() => {
      fireEvent.click(screen.getByText('Continue'));
    });
    await waitFor(() => {
      screen.getAllByText(/full description/i);
    });
    act(() => {
      fireEvent.click(screen.getByText('Continue'));
    });
    await waitFor(() => {
      screen.getByText('Build');
    });
    act(() => {
      fireEvent.click(screen.getByText('Continue'));
    });
    await waitFor(() => {
      screen.getByText('Design');
    });
    act(() => {
      fireEvent.click(screen.getByText('Continue'));
    });
    await waitFor(() => {
      screen.getByText('References');
    });
    act(() => {
      fireEvent.click(screen.getByText('Continue'));
    });
    await waitFor(() => {
      screen.getByText('Previous names');
    });
    act(() => {
      fireEvent.click(screen.getByText('Continue'));
    });
    await waitFor(() => {
      screen.getByText('Locations');
    });
    act(() => {
      fireEvent.click(screen.getByText('Continue'));
    });
    await waitFor(() => {
      screen.getByText('Registrations');
    });
    act(() => {
      fireEvent.click(screen.getByText('Continue'));
    });
    await waitFor(() => {
      screen.getByText('Construction');
    });
    act(() => {
      fireEvent.click(screen.getByText('Continue'));
    });
    await waitFor(() => {
      screen.getByText('Hull Form');
    });
    act(() => {
      fireEvent.click(screen.getByText('Continue'));
    });
    await waitFor(() => {
      screen.getByText('Handicaps');
    });
    act(() => {
      fireEvent.click(screen.getByText('I\'ll leave it for now'));
      fireEvent.click(screen.getByText('Continue'));
    });
    await waitFor(() => {
      screen.getByText('Known Owners');
    });
    act(() => {
      fireEvent.click(screen.getByText('Continue'));
    });
    await waitFor(() => userEvent.click(screen.getByText('Submit'), { pointerEventsCheck: 0 }))
    await sleep(400);
    expect(onSubmit).toBeCalled();
  });
});