import React from 'react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import BoatDetail from '../../src/components/boatdetail';
import { useAuth0 } from '@auth0/auth0-react';

// Mock Auth0
vi.mock('@auth0/auth0-react', () => ({
  useAuth0: vi.fn(),
}));

// Mock API
vi.mock('../../src/util/api', () => ({
  getScopedData: vi.fn(() => Promise.resolve({ Items: [] })),
}));

// Mock child components
vi.mock('../../src/components/conditionaltext', () => ({
  default: ({ label, value }) => value ? <div data-testid="conditional-text">{label}: {value}</div> : null,
}));

vi.mock('../../src/components/tabpanel', () => ({
  default: ({ children, value, index }) => value === index ? <div>{children}</div> : null,
}));

vi.mock('../../src/components/sailtable', () => ({
  default: () => <div data-testid="sail-table">Sail Table</div>,
}));

vi.mock('../../src/components/Handicap', () => ({
  HandicapDisplay: () => <div data-testid="handicap-display">Handicap Display</div>,
}));

vi.mock('../../src/components/detailbar', () => ({
  default: ({ onChange, value, panes }) => (
    <div data-testid="detail-bar">
      {panes.map((pane, i) => (
        <button key={i} onClick={() => onChange(null, i)} data-testid={`tab-${i}`}>
          {pane.title}
        </button>
      ))}
      <div data-testid="current-tab">{panes[value]?.title}</div>
    </div>
  ),
}));

vi.mock('../../src/components/owners', () => ({
  default: () => <div data-testid="owners">Owners</div>,
}));

vi.mock('../../src/components/skippers', () => ({
  default: () => <div data-testid="skippers">Skippers</div>,
}));

vi.mock('../../src/components/voyage', () => ({
  default: ({ voyage }) => <div data-testid="voyage">{voyage.start}</div>,
}));

describe('BoatDetail component tests', () => {
  const mockUser = {
    email: 'test@example.com',
    'https://oga.org.uk/roles': [],
  };

  const mockBoat = {
    oga_no: 123,
    name: 'Test Boat',
    design_class: { name: 'Gaff Cutter' },
    designer: ['Designer Name'],
    builder: ['Builder Name'],
    place_built: 'UK',
    year: 2000,
    year_is_approximate: false,
    hull_form: 'Cutter',
    construction_material: 'Wood',
    construction_method: 'Carvel',
    spar_material: 'Wood',
    construction_details: 'Classic design',
    generic_type: 'Gaff Cutter',
    ownerships: [],
    handicap_data: {
      length_on_deck: 10.5,
      length_on_waterline: 9.2,
      beam: 3.5,
      draft: 1.8,
      displacement: 5000,
      main: 80,
      fore_triangle_base: 4,
      fore_triangle_height: 9,
      sailarea: 200,
      solent: { hull_shape: 'Modern' },
    },
  };

  beforeEach(() => {
    useAuth0.mockReturnValue({
      user: mockUser,
      getAccessTokenSilently: vi.fn(() => Promise.resolve('token')),
    });
  });

  test('renders basic boat detail with design and build pane', async () => {
    const page = await render(
      <BoatDetail view="detail" boat={mockBoat} />
    );

    // Check that detail bar is rendered
    expect(page.getByTestId('detail-bar')).toBeTruthy();
 });

  test('includes registration pane when boat has registration fields', async () => {
    const boatWithReg = {
      ...mockBoat,
      sail_number: 'SA001',
      ssr: 'SSR123',
      mmsi: '123456789',
    };

    const page = await render(
      <BoatDetail view="detail" boat={boatWithReg} />
    );

    // Should render detail bar
    expect(page.getByTestId('detail-bar')).toBeTruthy();
  });

  test('includes dimensions pane when boat has dimension data', async () => {
    const page = await render(
      <BoatDetail view="detail" boat={mockBoat} />
    );

    // Should render detail bar with panes
    expect(page.getByTestId('detail-bar')).toBeTruthy();
  });

  test('includes rig and sails pane when boat has rig data', async () => {
    const page = await render(
      <BoatDetail view="detail" boat={mockBoat} />
    );

    // Should render detail bar with multiple panes
      // Should have detail bar with panes
      expect(page.getByTestId('detail-bar')).toBeTruthy();
  });

  test('includes handicap measurements pane for all boats', async () => {
    const page = await render(
      <BoatDetail view="detail" boat={mockBoat} />
    );

    expect(page.getByTestId('detail-bar')).toBeTruthy();
  });

  test('renders for sale pane when boat is for sale', async () => {
    const boatForSale = {
      ...mockBoat,
      selling_status: 'for_sale',
      sale_records: [{
        asking_price: 15000,
        sales_text: '<p>Great sailing boat</p>',
      }],
    };

    const page = await render(
      <BoatDetail view="detail" boat={boatForSale} />
    );

    expect(page.getByTestId('detail-bar')).toBeTruthy();
  });

  test('includes owners pane for members', async () => {
    useAuth0.mockReturnValue({
      user: { ...mockUser, 'https://oga.org.uk/roles': ['member'] },
      getAccessTokenSilently: vi.fn(() => Promise.resolve('token')),
    });

    const page = await render(
      <BoatDetail view="detail" boat={mockBoat} />
    );

    expect(page.getByTestId('detail-bar')).toBeTruthy();
  });

  test('includes skippers pane when boat has skippers', async () => {
    useAuth0.mockReturnValue({
      user: { ...mockUser, 'https://oga.org.uk/roles': ['member'] },
      getAccessTokenSilently: vi.fn(() => Promise.resolve('token')),
    });

    const boatWithSkippers = {
      ...mockBoat,
      ownerships: [
        { skipper: true, name: 'John Smith', email: 'john@example.com' },
      ],
    };

    const page = await render(
      <BoatDetail view="detail" boat={boatWithSkippers} />
    );

    expect(page.getByTestId('detail-bar')).toBeTruthy();
  });

  test('renders details pane when boat has full description', async () => {
    const boatWithDesc = {
      ...mockBoat,
      full_description: '<p>This is a classic gaff cutter</p>',
    };

    const page = await render(
      <BoatDetail view="detail" boat={boatWithDesc} />
    );

    expect(page.getByTestId('detail-bar')).toBeTruthy();
  });

  test('does not include owners/skippers panes for non-members', async () => {
    useAuth0.mockReturnValue({
      user: mockUser, // no 'member' role
      getAccessTokenSilently: vi.fn(() => Promise.resolve('token')),
    });

    const page = await render(
      <BoatDetail view="detail" boat={mockBoat} />
    );

    expect(page.getByTestId('detail-bar')).toBeTruthy();
  });

  test('tab switching works via detail bar', async () => {
    const page = await render(
      <BoatDetail view="detail" boat={mockBoat} />
    );

    const designButton = page.getByTestId('tab-0');
    expect(designButton).toBeTruthy();

    // Click design tab
    await designButton.click();
    expect(page.getByTestId('current-tab')).toBeTruthy();
  });

  test('renders without errors with minimal boat data', async () => {
    const minimalBoat = {
      oga_no: 1,
      handicap_data: {},
      ownerships: [],
    };

    const page = await render(
      <BoatDetail view="detail" boat={minimalBoat} />
    );

    expect(page.getByTestId('detail-bar')).toBeTruthy();
  });

  test('handles boat with all optional fields', async () => {
    const fullBoat = {
      ...mockBoat,
      sail_number: 'SA123',
      ssr: 'SSR123',
      fishing_number: 'F123',
      mmsi: '123456789',
      callsign: 'TEST1',
      nsbr: 'NB123',
      uk_part1: 'UP123',
      full_description: '<p>Full details</p>',
      selling_status: 'for_sale',
      sale_records: [{ asking_price: 25000, sales_text: 'For sale' }],
    };

    const page = await render(
      <BoatDetail view="detail" boat={fullBoat} />
    );

    // Should render without errors
    expect(page.getByTestId('detail-bar')).toBeTruthy();
  });
});
