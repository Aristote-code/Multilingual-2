import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import Login from '../Login';
import i18n from '../../i18n';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('Login', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <Login />
        </I18nextProvider>
      </BrowserRouter>
    );
  });

  it('renders login form', () => {
    expect(screen.getByPlaceholderText('common.username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('common.password')).toBeInTheDocument();
    expect(screen.getByText('common.submit')).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    const usernameInput = screen.getByPlaceholderText('common.username');
    const passwordInput = screen.getByPlaceholderText('common.password');
    const submitButton = screen.getByText('common.submit');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('displays error on failed login', async () => {
    const submitButton = screen.getByText('common.submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});