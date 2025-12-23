import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Login } from './Login';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, type Mock } from 'vitest';
import { login } from '../services/api';
import * as authContext from '../contexts/AuthContext';

// Mock the API module
vi.mock('../services/api', () => ({
    login: vi.fn(),
}));

vi.mock('../contexts/AuthContext');

describe('Login Page', () => {
    const mockOnLoginSuccess = vi.fn();
    const mockSignIn = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        // Setup default mock return values
        vi.mocked(authContext.useAuth).mockReturnValue({
            signIn: mockSignIn,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
    });

    it('renders login form correctly', () => {
        render(
            <MemoryRouter>
                <Login onLoginSuccess={mockOnLoginSuccess} />
            </MemoryRouter>
        );

        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();
    });

    it('updates input values when typing', () => {
        render(
            <MemoryRouter>
                <Login onLoginSuccess={mockOnLoginSuccess} />
            </MemoryRouter>
        );

        const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement;
        const passwordInput = screen.getByLabelText(/Senha/i) as HTMLInputElement;

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(emailInput.value).toBe('test@example.com');
        expect(passwordInput.value).toBe('password123');
    });

    it('calls login api and signIn context on successful submission', async () => {
        const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };
        const mockToken = 'fake-jwt-token';

        // Mock successful login response
        (login as Mock).mockResolvedValue({
            user: mockUser,
            token: mockToken
        });

        render(
            <MemoryRouter>
                <Login onLoginSuccess={mockOnLoginSuccess} />
            </MemoryRouter>
        );

        const emailInput = screen.getByLabelText(/Email/i);
        const passwordInput = screen.getByLabelText(/Senha/i);
        const submitButton = screen.getByRole('button', { name: /Entrar/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: '123456' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(login).toHaveBeenCalledWith('test@example.com', '123456');
            expect(mockSignIn).toHaveBeenCalledWith(mockToken, mockUser);
            expect(mockOnLoginSuccess).toHaveBeenCalled();
        });
    });

    it('displays toast error on login failure', async () => {
        // Mock failure response
        (login as Mock).mockRejectedValue(new Error('Invalid credentials'));
        // Mock console.error to avoid polluting test output
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        render(
            <MemoryRouter>
                <Login onLoginSuccess={mockOnLoginSuccess} />
            </MemoryRouter>
        );

        const emailInput = screen.getByLabelText(/Email/i);
        const passwordInput = screen.getByLabelText(/Senha/i);
        const submitButton = screen.getByRole('button', { name: /Entrar/i });

        // Fill inputs to satisfy HTML5 validation
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

        fireEvent.click(submitButton);

        // Verify login was called
        await waitFor(() => {
            expect(login).toHaveBeenCalled();
        });

        // Check for error toast text
        expect(await screen.findByText(/Falha no login/i)).toBeInTheDocument();

        consoleSpy.mockRestore();
    });
});
