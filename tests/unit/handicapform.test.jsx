import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import HandicapForm from '../../src/components/handicapform';

vi.mock('react-konva', async () => {
  const ReactModule = await import('react');
  const Container = ({ children }) => ReactModule.createElement('div', null, children);
  const Text = ({ text }) => ReactModule.createElement('span', null, text);

  return {
    Arrow: Container,
    Group: Container,
    Label: Container,
    Layer: Container,
    Line: Container,
    Path: Container,
    Stage: Container,
    Tag: Container,
    Text,
  };
});

const boat = {
  rig_type: 'Cutter',
  handicap_data: {
    beam: 3,
    displacement: 5000,
    draft: 1.5,
    fore_triangle_base: 4,
    fore_triangle_height: 9,
    length_on_deck: 10,
    length_on_waterline: 8,
    main: { foot: 4, head: 2, luff: 5, type: 'gaff' },
    topsail: { luff: 3, perpendicular: 2 },
  },
};

describe('HandicapForm', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders measurement guidance and boat handicap details', () => {
    render(<HandicapForm boat={boat} />);

    expect(screen.getByText('feet')).toBeTruthy();
    expect(screen.getByText('metres')).toBeTruthy();
    expect(screen.getByText('Sail Dimensions')).toBeTruthy();
    expect(screen.getByText('Rig Type = Cutter')).toBeTruthy();
    expect(screen.getByText('Propellor Type = not specified')).toBeTruthy();
    expect(screen.getByText('Displacement = 5000 kg')).toBeTruthy();
    expect(screen.getByText('Hull Shape (Solent) = not known')).toBeTruthy();
  });

  test('switches diagram measurements between feet and metres', () => {
    const { container } = render(<HandicapForm boat={boat} />);
    const diagramLabels = () => [...container.querySelectorAll('span')].map((span) => span.textContent);

    expect(diagramLabels()).toContain('LOD=32.81 ft');

    const unitsSwitch = screen.getByRole('checkbox', { name: 'two-label-switch' });
    fireEvent.click(unitsSwitch);

    expect(diagramLabels()).toContain('LOD=10.00 m');
    expect(diagramLabels()).not.toContain('LOD=32.81 ft');

    fireEvent.click(unitsSwitch);
    expect(diagramLabels()).toContain('LOD=32.81 ft');
  });
});
