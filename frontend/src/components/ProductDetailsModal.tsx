import React from 'react';
import type { Product } from '../types';
import { Modal } from './ui/Modal';

interface ProductDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ isOpen, onClose, product }) => {
    if (!product) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detalhes do Produto">
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Nome</label>
                        <p className="mt-1 text-sm text-gray-900 font-medium">{product.name}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Categoria</label>
                        <p className="mt-1 text-sm text-gray-900">{product.category}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Preço</label>
                        <p className="mt-1 text-sm text-gray-900">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Estoque</label>
                        <p className="mt-1 text-sm text-gray-900">{product.stock}</p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Descrição</label>
                    <div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
                        {product.description || 'Nenhuma descrição informada.'}
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </Modal>
    );
};
