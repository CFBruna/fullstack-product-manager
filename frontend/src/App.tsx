import { useCallback, useEffect, useState } from 'react';
import type { Product, ProductInput } from './types';
import { getProducts, createProduct, updateProduct, deleteProduct } from './services/api';
import { ProductForm } from './components/ProductForm';
import { ProductList } from './components/ProductList';
import { Toast, type ToastType } from './components/ui/Toast';
import { Modal } from './components/ui/Modal';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { ConfirmationModal } from './components/ui/ConfirmationModal';
import { Plus, Package } from 'lucide-react';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products', error);
      showToast('Falha ao carregar produtos', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleCreate = async (data: ProductInput) => {
    try {
      await createProduct(data);
      await loadProducts();
      setIsModalOpen(false);
      showToast('Produto criado com sucesso', 'success');
    } catch (error) {
      console.error('Failed to create product', error);
      showToast('Falha ao criar produto', 'error');
    }
  };

  const handleUpdate = async (data: ProductInput) => {
    if (!editingProduct) return;
    try {
      await updateProduct(editingProduct.id, data);
      await loadProducts();
      setEditingProduct(null);
      setIsModalOpen(false);
      showToast('Produto atualizado com sucesso', 'success');
    } catch (error) {
      console.error('Failed to update product', error);
      showToast('Falha ao atualizar produto', 'error');
    }
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteProduct(deletingId);
      await loadProducts();
      showToast('Produto excluído com sucesso', 'success');
      setDeletingId(null);
    } catch (error) {
      console.error('Failed to delete product', error);
      showToast('Falha ao excluir produto', 'error');
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingProduct(null);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Package className="text-white h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Gerenciador de Produtos</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 sm:truncate">Visão Geral</h2>
            <p className="mt-1 text-sm text-gray-500">Gerencie seu estoque de produtos com eficiência.</p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Novo Produto
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <ProductList
            products={products}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onView={setViewingProduct}
          />
        )}
      </main>

      {/* Modals & Overlays */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingProduct ? 'Editar Produto' : 'Criar Novo Produto'}
      >
        <ProductForm
          key={editingProduct ? editingProduct.id : 'new'}
          onSubmit={editingProduct ? handleUpdate : handleCreate}
          initialData={editingProduct}
          onCancel={closeModal}
        />
      </Modal>

      <ConfirmationModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
      />

      <ProductDetailsModal
        isOpen={!!viewingProduct}
        product={viewingProduct}
        onClose={() => setViewingProduct(null)}
      />



      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
