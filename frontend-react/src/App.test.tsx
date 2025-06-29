import { render, screen } from '@testing-library/react';
import AppWithProvider from './App';

test('renders loading initially', () => {
  // Mock useAuth to return loading true
  jest.spyOn(require('./contexts/AuthContext'), 'useAuth').mockReturnValue({ loading: true });
  render(<AppWithProvider />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

test('renders login page when not authenticated', () => {
  jest.spyOn(require('./contexts/AuthContext'), 'useAuth').mockReturnValue({ loading: false, isAuthenticated: false });
  render(<AppWithProvider />);
  expect(screen.getByText(/login to littlebill/i)).toBeInTheDocument();
});
