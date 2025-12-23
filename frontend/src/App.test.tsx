import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App', () => {
    it('renders the product manager title', () => {
        render(
            <AuthProvider>
                <MemoryRouter>
                    <App />
                </MemoryRouter>
            </AuthProvider>
        );
        expect(screen.getByText('Gerenciador de Produtos')).toBeInTheDocument();
    });

    it('toggles header visibility on scroll', () => {
        render(
            <AuthProvider>
                <MemoryRouter>
                    <App />
                </MemoryRouter>
            </AuthProvider>
        );

        const header = screen.getByRole('banner');
        expect(header).toHaveClass('translate-y-0');

        // We need to define scrollY on window because jsdom doesn't update it on scroll event automatically
        Object.defineProperty(window, 'scrollY', { value: 0, writable: true });

        // Scroll down
        window.scrollY = 100;
        fireEvent.scroll(window);
        expect(header).toHaveClass('-translate-y-full');

        // Scroll up
        window.scrollY = 50;
        fireEvent.scroll(window);
        expect(header).toHaveClass('translate-y-0');
    });

    it('handles logout properly', async () => {

        const user = { id: 1, name: 'Test User', email: 'test@test.com' };
        localStorage.setItem('@App:token', 'valid-token');
        localStorage.setItem('@App:user', JSON.stringify(user));

        render(
            <AuthProvider>
                <MemoryRouter>
                    <App />
                </MemoryRouter>
            </AuthProvider>
        );

        // Expect user name to be displayed
        expect(screen.getByText('Test User')).toBeInTheDocument();

        // Click logout
        const logoutButton = screen.getByText('Sair');
        fireEvent.click(logoutButton);

        expect(screen.queryByText('Test User')).not.toBeInTheDocument();
        expect(localStorage.getItem('@App:token')).toBeNull();
    });
});
