import React from 'react';
import type { Product } from '../types';
import { Pencil, Trash2, Package, Eye } from 'lucide-react';

interface ProductListProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
    onView: (product: Product) => void;
    isAuthenticated: boolean;
}

export const ProductList: React.FC<ProductListProps> = ({ products, onEdit, onDelete, onView, isAuthenticated }) => {
    if (products.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
                <div className="mx-auto h-12 w-12 text-gray-300 mb-4">
                    <Package size={48} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Nenhum produto encontrado</h3>
                <p className="mt-1 text-sm text-gray-500">Comece criando um novo produto.</p>
            </div>
        );
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Produto</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoria</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Preço</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estoque</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50/80 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]" title={product.name}>{product.name}</div>
                                    {product.description && (
                                        <div className="text-xs text-gray-400 truncate max-w-xs">{product.description}</div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                                    {formatCurrency(product.price)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`text-sm ${product.stock > 0 ? 'text-gray-600' : 'text-red-500 font-medium'}`}>
                                        {product.stock} unidades
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {isAuthenticated && (
                                        <button
                                            onClick={() => onEdit(product)}
                                            className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-full transition-colors mr-1"
                                            title="Editar"
                                            aria-label="Editar produto"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onView(product)}
                                        className="text-gray-500 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-full transition-colors mr-1"
                                        title="Ver Detalhes"
                                        aria-label="Ver detalhes do produto"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    {isAuthenticated && (
                                        <button
                                            onClick={() => onDelete(product.id)}
                                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                                            title="Excluir"
                                            aria-label="Excluir produto"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden grid grid-cols-1 divide-y divide-gray-200">
                {products.map((product) => (
                    <div key={product.id} className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                                <div className="text-xs text-gray-500 mt-1">{product.category}</div>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">{formatCurrency(product.price)}</span>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                            <span className={`text-xs ${product.stock > 0 ? 'text-gray-500' : 'text-red-500 font-medium'}`}>
                                Estoque: {product.stock}
                            </span>
                            <div className="flex space-x-2">
                                {isAuthenticated && (
                                    <button
                                        onClick={() => onEdit(product)}
                                        className="p-2 text-indigo-600 bg-indigo-50 rounded-lg"
                                        aria-label="Editar produto"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                )}
                                <button
                                    onClick={() => onView(product)}
                                    className="p-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                                    aria-label="Ver detalhes do produto"
                                >
                                    <Eye size={16} />
                                </button>
                                {isAuthenticated && (
                                    <button
                                        onClick={() => onDelete(product.id)}
                                        className="p-2 text-red-600 bg-red-50 rounded-lg"
                                        aria-label="Excluir produto"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
