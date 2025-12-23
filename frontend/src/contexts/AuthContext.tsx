import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';


interface User {
    id: number;
    email: string;
    name: string;
}

interface AuthContextData {
    signed: boolean;
    user: User | null;
    signIn: (token: string, user: User) => void;
    signOut: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStorageData = () => {
            const storagedUser = localStorage.getItem('@App:user');
            const storagedToken = localStorage.getItem('@App:token');

            if (storagedToken && storagedUser) {
                setUser(JSON.parse(storagedUser));
                axios.defaults.headers.common['Authorization'] = `Bearer ${storagedToken}`;
            }
            setLoading(false);
        };

        loadStorageData();
    }, []);

    const signIn = (token: string, user: User) => {
        setUser(user);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        localStorage.setItem('@App:user', JSON.stringify(user));
        localStorage.setItem('@App:token', token);
    };

    const signOut = () => {
        setUser(null);
        localStorage.removeItem('@App:user');
        localStorage.removeItem('@App:token');
    };

    return (
        <AuthContext.Provider value={{ signed: !!user, user, signIn, signOut, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    return context;
}
