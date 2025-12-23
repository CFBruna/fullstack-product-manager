import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductForm } from './ProductForm';
import { vi, describe, it, expect } from 'vitest';

describe('ProductForm Component', () => {
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();

    it('renders empty form initially', () => {
        render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

        expect(screen.getByPlaceholderText(/Nome do Produto/i)).toHaveValue('');
        expect(screen.getByPlaceholderText(/0,00/i)).toHaveValue(null);
        expect(screen.getByPlaceholderText('0')).toHaveValue(null);
        expect(screen.getByPlaceholderText(/Eletrônicos/i)).toHaveValue('');
        expect(screen.getByPlaceholderText(/Descrição opcional/i)).toHaveValue('');
        expect(screen.getByText('Criar Produto')).toBeInTheDocument();
    });

    it('updates fields when user types', () => {
        render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

        fireEvent.change(screen.getByPlaceholderText(/Nome do Produto/i), { target: { value: 'Smartphone' } });
        fireEvent.change(screen.getByPlaceholderText(/0,00/i), { target: { value: '1000' } });
        fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '50' } });
        fireEvent.change(screen.getByPlaceholderText(/Eletrônicos/i), { target: { value: 'Electronics' } });
        fireEvent.change(screen.getByPlaceholderText(/Descrição opcional/i), { target: { value: 'Best phone' } });

        expect(screen.getByPlaceholderText(/Nome do Produto/i)).toHaveValue('Smartphone');
        expect(screen.getByPlaceholderText(/0,00/i)).toHaveValue(1000);
        expect(screen.getByPlaceholderText('0')).toHaveValue(50);
    });

    it('calls onSubmit with correct data when submitted', async () => {
        render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

        fireEvent.change(screen.getByPlaceholderText(/Nome do Produto/i), { target: { value: 'Mouse' } });
        fireEvent.change(screen.getByPlaceholderText(/0,00/i), { target: { value: '50.50' } });
        fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '100' } });
        fireEvent.change(screen.getByPlaceholderText(/Eletrônicos/i), { target: { value: 'Peripherals' } });

        fireEvent.submit(screen.getByRole('button', { name: /Criar Produto/i }));

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith({
                name: 'Mouse',
                price: 50.50,
                stock: 100,
                category: 'Peripherals',
                description: ''
            });
        });
    });

    it('populates form with initial data for editing', () => {
        const initialData = {
            id: 1,
            name: 'Existing Product',
            price: 200,
            category: 'Tools',
            stock: 20,
            description: 'Existing description',
            createdAt: '2023-01-01',
            updatedAt: '2023-01-01'
        };

        render(
            <ProductForm
                onSubmit={mockOnSubmit}
                onCancel={mockOnCancel}
                initialData={initialData}
            />
        );

        expect(screen.getByDisplayValue('Existing Product')).toBeInTheDocument();
        expect(screen.getByDisplayValue(200)).toBeInTheDocument();
        expect(screen.getByText('Atualizar Produto')).toBeInTheDocument();
    });

    it('calls onCancel when cancel button is clicked', () => {
        render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

        fireEvent.click(screen.getByText('Cancelar'));
        expect(mockOnCancel).toHaveBeenCalled();
    });
});
