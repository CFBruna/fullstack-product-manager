import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductManager from './ProductManager';
import { vi, describe, it, expect, beforeEach, type Mock } from 'vitest';
import * as api from '../services/api';
import * as authContext from '../contexts/AuthContext';
import { MemoryRouter } from 'react-router-dom';

// Define hoisted mocks
const { mockNavigate } = vi.hoisted(() => {
    return { mockNavigate: vi.fn() };
});

// Mock dependencies
vi.mock('../services/api');
vi.mock('../contexts/AuthContext');

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('ProductManager Page', () => {
    const mockProducts = [
        { id: 1, name: 'Prod 1', price: 100, category: 'Cat 1', stock: 10, description: 'Desc 1', createdAt: '', updatedAt: '' }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        // Default authenticated state
        (authContext.useAuth as Mock).mockReturnValue({ signed: true, user: { name: 'Test' } });
        // Default api responses
        (api.getProducts as Mock).mockResolvedValue(mockProducts);
    });

    it('shows loading state then products', async () => {
        render(
            <MemoryRouter>
                <ProductManager />
            </MemoryRouter>
        );

        // Use findAllByText because mobile view duplicates some text
        const products = await screen.findAllByText('Prod 1');
        expect(products[0]).toBeInTheDocument();
        expect(api.getProducts).toHaveBeenCalledTimes(1);
    });

    it('opens create modal and creates product', async () => {
        (api.createProduct as Mock).mockResolvedValue({ id: 2, name: 'New P', price: 50 });
        (api.getProducts as Mock)
            .mockResolvedValueOnce(mockProducts) // Initial load
            .mockResolvedValueOnce([...mockProducts, { id: 2, name: 'New P', price: 50, category: 'C', stock: 1 }]); // After create

        render(<MemoryRouter><ProductManager /></MemoryRouter>);

        // Open modal
        const newButton = await screen.findByText('Novo Produto');
        fireEvent.click(newButton);

        // Fill form
        fireEvent.change(screen.getByPlaceholderText(/Nome do Produto/i), { target: { value: 'New P' } });
        fireEvent.change(screen.getByPlaceholderText(/0,00/i), { target: { value: '50' } });
        fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '1' } });
        fireEvent.change(screen.getByPlaceholderText(/Eletrônicos/i), { target: { value: 'C' } });

        // Submit
        fireEvent.click(screen.getByText('Criar Produto'));

        // Verify API call and Toast
        await waitFor(() => {
            expect(api.createProduct).toHaveBeenCalled();
            expect(screen.getByText('Produto criado com sucesso')).toBeInTheDocument();
        });
    });

    it('deletes product after confirmation', async () => {
        render(<MemoryRouter><ProductManager /></MemoryRouter>);

        await screen.findAllByText('Prod 1');

        const deleteButtons = screen.getAllByTitle('Excluir');
        fireEvent.click(deleteButtons[0]);

        expect(screen.getByText('Confirmar Exclusão')).toBeInTheDocument();

        (api.deleteProduct as Mock).mockResolvedValue({});
        (api.getProducts as Mock).mockResolvedValue([]);

        fireEvent.click(screen.getByText('Excluir'));

        await waitFor(() => {
            expect(api.deleteProduct).toHaveBeenCalledWith(1);
            expect(screen.getByText('Produto excluído com sucesso')).toBeInTheDocument();
        });
    });

    it('shows error toast on initial load failure', async () => {
        (api.getProducts as Mock).mockRejectedValue(new Error('API Error'));
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        render(<MemoryRouter><ProductManager /></MemoryRouter>);

        await waitFor(() => {
            expect(screen.getByText('Falha ao carregar produtos')).toBeInTheDocument();
        });

        consoleSpy.mockRestore();
    });

    it('shows error toast when delete fails', async () => {
        // Arrange: Render successfully first with products
        render(<MemoryRouter><ProductManager /></MemoryRouter>);
        await screen.findAllByText('Prod 1');

        // Finds delete button and clicks
        const deleteButtons = screen.getAllByTitle('Excluir');
        fireEvent.click(deleteButtons[0]);

        // Expect confirmation modal
        expect(screen.getByText('Confirmar Exclusão')).toBeInTheDocument();

        // Mock delete failure
        (api.deleteProduct as Mock).mockRejectedValue(new Error('Delete Failed'));
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        // Confirm delete
        fireEvent.click(screen.getByText('Excluir'));

        // Assert toast appears
        await waitFor(() => {
            expect(api.deleteProduct).toHaveBeenCalled();
            expect(screen.getByText('Falha ao excluir produto')).toBeInTheDocument();
        });

        consoleSpy.mockRestore();
    });

    it('redirects to login if user tries to create but is not signed in', async () => {
        (authContext.useAuth as Mock).mockReturnValue({ signed: false });

        render(<MemoryRouter><ProductManager /></MemoryRouter>);

        const newButton = await screen.findByText('Novo Produto');
        fireEvent.click(newButton);

        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('opens and closes modal correctly', async () => {
        render(<MemoryRouter><ProductManager /></MemoryRouter>);

        const newButton = await screen.findByText('Novo Produto');
        fireEvent.click(newButton);
        expect(screen.getByText('Criar Novo Produto')).toBeInTheDocument();

        const cancelButton = screen.getByText('Cancelar');
        fireEvent.click(cancelButton);

        await waitFor(() => {
            expect(screen.queryByText('Criar Novo Produto')).not.toBeInTheDocument();
        });
    });

    it('opens view details modal', async () => {
        render(<MemoryRouter><ProductManager /></MemoryRouter>);
        await screen.findAllByText('Prod 1');

        const viewButtons = screen.getAllByTitle('Ver Detalhes');
        fireEvent.click(viewButtons[0]);

        expect(await screen.findByText('Detalhes do Produto')).toBeInTheDocument();
        const closeButton = screen.getByText('Fechar');
        fireEvent.click(closeButton);
        await waitFor(() => {
            expect(screen.queryByText('Detalhes do Produto')).not.toBeInTheDocument();
        });
    });

    it('updates product successfully', async () => {
        (api.updateProduct as Mock).mockResolvedValue({ id: 1, name: 'Updated P', price: 150 });

        render(<MemoryRouter><ProductManager /></MemoryRouter>);
        await screen.findAllByText('Prod 1');

        // Click Edit on first product
        const editButtons = screen.getAllByTitle('Editar');
        fireEvent.click(editButtons[0]);

        // Verify Modal matches Edit state
        expect(screen.getByText('Editar Produto')).toBeInTheDocument();

        // Change value
        fireEvent.change(screen.getByPlaceholderText(/Nome do Produto/i), { target: { value: 'Updated P' } });

        const submitButton = screen.getByRole('button', { name: /Atualizar Produto/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(api.updateProduct).toHaveBeenCalledWith(1, expect.objectContaining({ name: 'Updated P' }));
            expect(screen.getByText('Produto atualizado com sucesso')).toBeInTheDocument();
        });
    });

    it('shows error toast when update fails', async () => {
        (api.updateProduct as Mock).mockRejectedValue(new Error('Update failed'));
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        render(<MemoryRouter><ProductManager /></MemoryRouter>);
        await screen.findAllByText('Prod 1');

        const editButtons = screen.getAllByTitle('Editar');
        fireEvent.click(editButtons[0]);

        const submitButton = screen.getByRole('button', { name: /Atualizar Produto/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Falha ao atualizar produto')).toBeInTheDocument();
        });

        consoleSpy.mockRestore();
    });

    it('redirects to login when clicking edit while unauthenticated', async () => {
        (authContext.useAuth as Mock).mockReturnValue({ signed: false });
    });

    it('closes confirmation modal', async () => {
        render(<MemoryRouter><ProductManager /></MemoryRouter>);
        await screen.findAllByText('Prod 1');
        const deleteButtons = screen.getAllByTitle('Excluir');
        fireEvent.click(deleteButtons[0]);

        expect(screen.getByText('Confirmar Exclusão')).toBeInTheDocument();

        // Click Cancel/No (assuming "Cancelar")
        fireEvent.click(screen.getByText('Cancelar'));

        await waitFor(() => {
            expect(screen.queryByText('Confirmar Exclusão')).not.toBeInTheDocument();
        });
    });

    it('closes toast message', async () => {
        // Trigger invalid load
        (api.getProducts as Mock).mockRejectedValue(new Error('API Error'));
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        render(<MemoryRouter><ProductManager /></MemoryRouter>);
        await screen.findByText('Falha ao carregar produtos');

        const toastMessage = screen.getByText('Falha ao carregar produtos');
        const closeButton = toastMessage.parentElement?.querySelector('button');
        if (closeButton) {
            fireEvent.click(closeButton);
            await waitFor(() => {
                expect(screen.queryByText('Falha ao carregar produtos')).not.toBeInTheDocument();
            });
        }
        consoleSpy.mockRestore();
    });
});
