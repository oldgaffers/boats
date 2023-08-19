import React from "react";
import { act, render, screen } from "@testing-library/react";
import EditBoatWizard from '../components/editboatwizard';
import '../components/boatregisterposts';

jest.mock('../components/boatregisterposts', () => {
  return {
  getPicklists: async () => ({ data: [] }),
  };
});

describe('EditBoatWizard component tests', () => {
  test('EditBoatWizard test rendering', () => {
    act( () => {
    render(<EditBoatWizard open={true}/>);
    });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});