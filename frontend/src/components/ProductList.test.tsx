import { render, screen, fireEvent } from '@testing-library/react';
import { ProductList } from './ProductList';
import { describe, it, expect, vi } from 'vitest';
import type { Product } from '../types';

describe('ProductList Component', () => {
    const mockProducts: Product[] = [
        { id: 1, name: 'Produto 1', price: 100, category: 'Cat A', stock: 10, createdAt: '', updatedAt: '', description: 'Desc 1' },
        { id: 2, name: 'Produto 2', price: 200, category: 'Cat B', stock: 0, createdAt: '', updatedAt: '', description: 'Desc 2' },
    ];

    const mockHandlers = {
        onEdit: vi.fn(),
        onDelete: vi.fn(),
        onView: vi.fn(),
    };

    it('renders empty state when no products', () => {
        render(
            <ProductList
                products={[]}
                isAuthenticated={false}
                {...mockHandlers}
            />
        );
        expect(screen.getByText(/Nenhum produto encontrado/i)).toBeInTheDocument();
    });

    it('renders list of products', () => {
        render(
            <ProductList
                products={mockProducts}
                isAuthenticated={false}
                {...mockHandlers}
            />
        );

        // Usage of getAllByText because products appear in both Desktop and Mobile views
        expect(screen.getAllByText('Produto 1')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Produto 2')[0]).toBeInTheDocument();

        // Price checks (partial match)
        expect(screen.getAllByText(/200,00/)[0]).toBeInTheDocument();
    });

    it('should render mobile view on small screens', () => {
        // Resize window to mobile width
        Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });
        fireEvent(window, new Event('resize'));

        render(
            <ProductList
                products={mockProducts}
                isAuthenticated={false}
                {...mockHandlers}
            />
        );

        // Verify mobile card elements are present
        const stockElements = screen.getAllByText(/Estoque:/);
        expect(stockElements.length).toBeGreaterThan(0);

        const mobileContainer = document.querySelector('.md\\:hidden');
        expect(mobileContainer).toBeInTheDocument();
    });

    it('renders mobile specific actions when authenticated', () => {
        render(
            <ProductList
                products={mockProducts}
                isAuthenticated={true}
                {...mockHandlers}
            />
        );

        const editButtons = screen.getAllByLabelText('Editar produto');
        expect(editButtons.length).toBe(4);

        // Click ALL edit buttons to ensure all handlers (desktop & mobile) are covered
        editButtons.forEach(button => {
            fireEvent.click(button);
        });
        expect(mockHandlers.onEdit).toHaveBeenCalledTimes(4);

        const deleteButtons = screen.getAllByLabelText('Excluir produto');
        expect(deleteButtons.length).toBe(4);

        // Click ALL delete buttons
        deleteButtons.forEach(button => {
            fireEvent.click(button);
        });
        expect(mockHandlers.onDelete).toHaveBeenCalledTimes(4);

        const viewButtons = screen.getAllByLabelText('Ver detalhes do produto');
        expect(viewButtons.length).toBe(4);

        // Click ALL view buttons
        viewButtons.forEach(button => {
            fireEvent.click(button);
        });
        expect(mockHandlers.onView).toHaveBeenCalledTimes(4);
    });

    it('shows action buttons only when authenticated', () => {
        const { rerender } = render(
            <ProductList
                products={mockProducts}
                isAuthenticated={false}
                {...mockHandlers}
            />
        );

        // Not authenticated: Should NOT find Edit/Delete buttons
        expect(screen.queryByTitle(/Editar/i)).not.toBeInTheDocument();
        expect(screen.queryByTitle(/Excluir/i)).not.toBeInTheDocument();

        // View button is always visible - should find 2 per product (desktop + mobile) = 4 total
        expect(screen.getAllByTitle(/Ver Detalhes/i).length).toBeGreaterThan(0);

        // Authenticated: Should find Edit/Delete buttons
        rerender(
            <ProductList
                products={mockProducts}
                isAuthenticated={true}
                {...mockHandlers}
            />
        );

        expect(screen.getAllByTitle(/Editar/i).length).toBeGreaterThan(0);
        expect(screen.getAllByTitle(/Excluir/i).length).toBeGreaterThan(0);
    });
});
