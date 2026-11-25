import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the votes heading and restaurant buttons', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /votes/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /chipotle/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /buca di beppo/i })).toBeInTheDocument();
});
