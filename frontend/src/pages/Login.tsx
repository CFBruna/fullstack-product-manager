import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { login } from '../services/api';
import { Lock, Mail } from 'lucide-react';
import { Toast } from '../components/ui/Toast';

export const Login: React.FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setShowErrorToast(false);
        setLoading(true);

        try {
            const data = await login(email, password);
            signIn(data.token, data.user);
            onLoginSuccess();
        } catch (err) {
            console.error(err);
            setShowErrorToast(true);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-indigo-600 p-3 rounded-xl w-fit mx-auto shadow-lg">
                    <Lock className="h-8 w-8 text-white" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Entrar no Sistema
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Acesso restrito para administradores
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-gray-100 sm:rounded-lg sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5 border"
                                    placeholder="admin@exemplo.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Senha
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5 border"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>



                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {loading ? 'Carregando...' : 'Entrar'}

                            </button>
                        </div>

                        {/* Evaluator Hint Card */}
                        <div
                            onClick={() => {
                                setEmail('admin@teste.com');
                                setPassword('123456');
                            }}
                            className="mt-6 rounded-md bg-blue-50 p-4 border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors group text-center"
                        >
                            <h3 className="text-sm font-medium text-blue-800">🔐 Acesso para Avaliação</h3>
                            <div className="mt-2 text-sm text-blue-700">
                                <p>
                                    <span className="font-semibold">Email:</span> admin@teste.com
                                </p>
                                <p>
                                    <span className="font-semibold">Senha:</span> 123456
                                </p>
                                <p className="mt-2 text-xs text-blue-500 italic">
                                    Clique aqui para preencher automaticamente
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div >
            {showErrorToast && (
                <Toast
                    message="Falha no login. Verifique suas credenciais."
                    type="error"
                    onClose={() => setShowErrorToast(false)}
                />
            )}
        </div >
    );
};
