import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('Smoke Test - CKD Predict System', () => {
  test('renders dashboard and brand elements correctly', () => {
    render(<App />);

    // Brand title in sidebar and header
    expect(screen.getAllByText('Predict').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Smarter Screening. Healthier Tomorrow.').length).toBeGreaterThan(0);
  });
});
