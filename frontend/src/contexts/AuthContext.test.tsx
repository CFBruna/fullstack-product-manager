import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { vi, describe, it, expect, beforeEach } from 'vitest';

const TestComponent = () => {
    const { signed, user, signIn, signOut, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div data-testid="status">{signed ? 'Signed In' : 'Signed Out'}</div>
            <div data-testid="username">{user?.name}</div>
            <button onClick={() => signIn('token123', { id: 1, name: 'John Doe', email: 'john@example.com' })}>
                Login
            </button>
            <button onClick={signOut}>Logout</button>
        </div>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('loads initial state from localStorage', () => {
        const user = { id: 1, name: 'Stored User', email: 'stored@example.com' };
        localStorage.setItem('@App:token', 'stored-token');
        localStorage.setItem('@App:user', JSON.stringify(user));

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByTestId('status')).toHaveTextContent('Signed In');
        expect(screen.getByTestId('username')).toHaveTextContent('Stored User');
    });

    it('handles sign in correctly', () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByTestId('status')).toHaveTextContent('Signed Out');

        act(() => {
            screen.getByText('Login').click();
        });

        expect(screen.getByTestId('status')).toHaveTextContent('Signed In');
        expect(screen.getByTestId('username')).toHaveTextContent('John Doe');
        expect(localStorage.getItem('@App:token')).toBe('token123');
    });

    it('handles sign out correctly', () => {
        const user = { id: 1, name: 'John Doe', email: 'john@example.com' };
        localStorage.setItem('@App:token', 'token123');
        localStorage.setItem('@App:user', JSON.stringify(user));

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByTestId('status')).toHaveTextContent('Signed In');

        act(() => {
            screen.getByText('Logout').click();
        });

        expect(screen.getByTestId('status')).toHaveTextContent('Signed Out');
        expect(localStorage.getItem('@App:token')).toBeNull();
    });
});
