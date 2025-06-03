import { render, screen } from '@testing-library/react';
import App from './App';

test('renders add button', () => {
  render(<App />);
  const addButton = screen.getByRole('button', { name: /add/i });
  expect(addButton).toBeInTheDocument();
});
