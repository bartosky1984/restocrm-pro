
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UtensilsCrossed, ChefHat, LogIn } from 'lucide-react';

export default function Login() {
    const { signIn, signUp, signInDemo } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (isLogin) {
                await signIn(email, password);
            } else {
                await signUp(email, password, nombre);
            }
            navigate('/');
        } catch (err: any) {
            console.error('Login failed', err);
            setError(err.message || 'Error al autenticar');
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = () => {
        signInDemo();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-indigo-600 p-8 text-center text-white">
                    <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                        <ChefHat className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">Mesa Feliz CRM</h2>
                    <p className="text-indigo-100">Gestión inteligente para tu restaurante</p>
                </div>

                <div className="p-8">
                    <div className="space-y-4">
                        {error && (
                            <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm font-medium animate-shake">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleDemoLogin}
                            className="w-full flex items-center justify-center gap-3 bg-indigo-50 text-indigo-700 py-3 px-4 rounded-xl hover:bg-indigo-100 transition-colors font-bold shadow-sm"
                        >
                            <ChefHat className="w-5 h-5" />
                            Acceso Demo Rápido
                        </button>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-slate-500 font-medium italic">o usa tus credenciales</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 ml-1">Nombre Completo</label>
                                    <input
                                        type="text"
                                        required
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm font-bold transition-all"
                                        placeholder="Ej. Juan Pérez"
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 ml-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm font-bold transition-all"
                                    placeholder="tu@restaurante.com"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 ml-1">Contraseña</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm font-bold transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-slate-900 text-white py-4 rounded-xl hover:bg-slate-800 transition-all font-black text-sm shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 group disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        {isLogin ? 'Iniciar Sesión' : 'Registrar Restaurante'}
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="text-center pt-2">
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-xs text-slate-500 hover:text-indigo-600 font-bold transition-colors"
                            >
                                {isLogin ? '¿PRIMERA VEZ AQUÍ? REGÍSTRATE' : '¿YA TIENES CUENTA? INICIA SESIÓN'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

