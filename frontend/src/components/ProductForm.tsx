import React, { useState } from 'react';
import type { ProductInput, Product } from '../types';

interface ProductFormProps {
    onSubmit: (data: ProductInput) => Promise<void>;
    initialData?: Product | null;
    onCancel: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, initialData, onCancel }) => {
    const [formData, setFormData] = useState<{
        name: string;
        price: string | number;
        category: string;
        stock: string | number;
        description: string;
    }>(() => {
        if (initialData) {
            return {
                name: initialData.name,
                price: initialData.price,
                category: initialData.category,
                stock: initialData.stock,
                description: initialData.description || ''
            };
        }
        return {
            name: '',
            price: '',
            category: '',
            stock: '',
            description: ''
        };
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit({
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock)
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border transition-colors"
                    placeholder="Nome do Produto"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">R$</span>
                        </div>
                        <input
                            type="number"
                            name="price"
                            required
                            min="0"
                            step="0.01"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full rounded-lg border-gray-300 pl-9 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border transition-colors"
                            placeholder="0,00"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estoque</label>
                    <input
                        type="number"
                        name="stock"
                        required
                        min="0"
                        value={formData.stock}
                        onChange={handleChange}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border transition-colors"
                        placeholder="0"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <input
                    type="text"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border transition-colors"
                    placeholder="Eletrônicos, Roupas, etc."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                    name="description"
                    rows={3}
                    value={formData.description || ''}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border transition-colors"
                    placeholder="Descrição opcional..."
                />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-colors"
                >
                    {initialData ? 'Atualizar Produto' : 'Criar Produto'}
                </button>
            </div>
        </form>
    );
};
