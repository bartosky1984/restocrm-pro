
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '../types';
import { account, databases, APPWRITE_DB_ID } from '../lib/appwrite';
import { Models, ID, Query } from 'appwrite';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, nombre: string) => Promise<void>;
    signInDemo: () => void;
    signOut: () => Promise<void>;
    hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            console.log("AuthContext: Starting initAuth...");
            try {
                const session = await account.get();
                console.log("AuthContext: Session retrieved ->", session.email);
                if (session) {
                    await fetchProfile(session.email);
                }
            } catch (err) {
                console.log("AuthContext: No active session or error", err);
            } finally {
                setLoading(false);
            }
        };

        const checkAuth = async () => {
            try {
                const session = await account.get();
                if (session) {
                    await fetchProfile(session.email);
                }
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    async function fetchProfile(email: string) {
        try {
            console.log("AuthContext: Fetching profile for", email);
            const response = await databases.listDocuments(
                APPWRITE_DB_ID,
                'users',
                [Query.equal('email', email)]
            );

            if (response.documents.length > 0) {
                const doc = response.documents[0];
                setUser({
                    id: doc.$id,
                    restaurant_id: doc.restaurant_id,
                    nombre: doc.nombre,
                    email: doc.email,
                    avatar_url: doc.avatar_url || null,
                    rol: doc.rol as UserRole,
                    activo: doc.activo,
                    ultimo_login: doc.ultimo_login
                });
            } else {
                console.warn('AuthContext: Profile not found for email', email);
                // Create a default profile if it doesn't exist for a logged-in account (e.g. first login)
                // This is a safety measure for testing
                const newUserDoc = await databases.createDocument(
                    APPWRITE_DB_ID,
                    'users',
                    ID.unique(),
                    {
                        email: email,
                        nombre: email.split('@')[0],
                        restaurant_id: 'rest_default',
                        rol: 'ADMIN',
                        activo: true,
                        ultimo_login: new Date().toISOString()
                    }
                );
                await fetchProfile(email);
            }
        } catch (err: any) {
            console.error('AuthContext: Error fetching profile:', err);
            if (err.code === 401) {
                console.error("AuthContext: Permission denied. Check collection permissions.");
            }
        }
    }

    const signIn = async (email: string, password: string) => {
        try {
            await account.createEmailPasswordSession(email, password);
            await fetchProfile(email);
        } catch (error) {
            console.error('AuthContext: Sign in error', error);
            throw error;
        }
    };

    const signUp = async (email: string, password: string, nombre: string) => {
        try {
            const userId = ID.unique();
            await account.create(userId, email, password, nombre);
            await account.createEmailPasswordSession(email, password);

            // Create profile in database
            await databases.createDocument(
                APPWRITE_DB_ID,
                'users',
                ID.unique(),
                {
                    email,
                    nombre,
                    restaurant_id: 'rest_default', // Default for testing
                    rol: 'ADMIN',
                    activo: true,
                    ultimo_login: new Date().toISOString()
                }
            );

            await fetchProfile(email);
        } catch (error) {
            console.error('AuthContext: Sign up error', error);
            throw error;
        }
    };

    const signInDemo = () => {
        const dummyUser: User = {
            id: 'user_jorge',
            restaurant_id: 'rest_default',
            nombre: 'Admin Demo',
            email: 'jorge@test.com',
            avatar_url: null,
            rol: 'ADMIN',
            activo: true
        };
        setUser(dummyUser);
    };

    const signOut = async () => {
        try {
            await account.deleteSession('current');
        } catch (err) {
            console.error('AuthContext: Sign out error', err);
        }
        setUser(null);
    };

    const hasRole = (role: UserRole) => {
        return user?.rol === role;
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signInDemo, signOut, hasRole }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

