import React from 'react';
import { render, screen, act } from '@testing-library/react';
import App from '../App';

describe('CKD Predict - User Navigation Workflow', () => {
  test('renders dashboard by default', async () => {
    window.history.pushState({}, '', '/');
    await act(async () => {
      render(<App />);
    });
    expect(screen.getAllByText('Smarter Screening. Healthier Tomorrow.').length).toBeGreaterThan(0);
  });

  test('renders prediction page on /predict route', async () => {
    window.history.pushState({}, '', '/predict');
    await act(async () => {
      render(<App />);
    });
    expect(await screen.findByText('Patient CKD Risk Screening')).toBeInTheDocument();
  });

  test('renders ML Analysis page on /ml-analysis route', async () => {
    window.history.pushState({}, '', '/ml-analysis');
    await act(async () => {
      render(<App />);
    });
    expect(await screen.findByText('UCI Chronic Kidney Disease Dataset')).toBeInTheDocument();
    expect(await screen.findByText('Data Preprocessing Pipeline')).toBeInTheDocument();
  });
});
