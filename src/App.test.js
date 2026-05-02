import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  process.env.REACT_APP_VOTINGAPP_ENDPOINT = 'http://localhost:5000';
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    })
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders login form when not authenticated', () => {
  render(<App />);
  const loginForm = screen.getByTestId('login-form');
  expect(loginForm).toBeInTheDocument();
});

test('renders login button', () => {
  render(<App />);
  const loginButton = screen.getByTestId('login-button');
  expect(loginButton).toBeInTheDocument();
});
