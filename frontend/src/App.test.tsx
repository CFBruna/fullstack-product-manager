import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
    it('renders the product manager title', () => {
        render(<App />);
        expect(screen.getByText('Gerenciador de Produtos')).toBeInTheDocument();
    });
});
