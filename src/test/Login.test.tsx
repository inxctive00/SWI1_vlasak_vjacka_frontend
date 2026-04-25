import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import Login from '../components/Login';
import type { MockedFunction } from 'vitest';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('Login Component', () => {
  let mockOnLoginSuccess: MockedFunction<any>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnLoginSuccess = vi.fn();
  });

  it('renders login form', () => {
    render(<Login onLoginSuccess={mockOnLoginSuccess} />);

    expect(screen.getByLabelText(/jméno/i)).toBeTruthy();
    expect(screen.getByLabelText(/heslo/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /přihlásit se/i })).toBeTruthy();
  });

  it('submits login form successfully', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      data: {
        message: 'Login successful',
        username: 'testuser',
        role: 'USER',
        token: 'jwt-token'
      }
    };
    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    render(<Login onLoginSuccess={mockOnLoginSuccess} />);

    await user.type(screen.getByLabelText(/jméno/i), 'testuser');
    await user.type(screen.getByLabelText(/heslo/i), 'password');
    await user.click(screen.getByRole('button', { name: /přihlásit se/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:8080/api/auth/login', {
        username: 'testuser',
        password: 'password'
      });
      expect(mockOnLoginSuccess).toHaveBeenCalledWith(mockResponse.data);
    });
  });

  it('shows error on login failure', async () => {
    const user = userEvent.setup();
    const mockError = {
      response: {
        data: { error: 'Invalid credentials' }
      }
    };
    mockedAxios.post.mockRejectedValueOnce(mockError);

    render(<Login onLoginSuccess={mockOnLoginSuccess} />);

    await user.type(screen.getByLabelText(/jméno/i), 'wronguser');
    await user.type(screen.getByLabelText(/heslo/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /přihlásit se/i }));

    await waitFor(() => {
      expect(screen.getByText('Chyba při komunikaci se serverem')).toBeTruthy();
    });
  });
});
