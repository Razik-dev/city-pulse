"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

type AuthContextType = {
    isAuthenticated: boolean;
    user: (User & { role?: string; points?: number; full_name?: string }) | null;
    login: (email: string, fullName?: string, role?: string) => void;
    logout: () => void;
    updateUser: (updates: Partial<(User & { role?: string; points?: number; full_name?: string })>) => void;
};

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    user: null,
    login: () => { },
    logout: () => { },
    updateUser: () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const savedUser = localStorage.getItem("mock_user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = (email: string, fullName?: string, role: string = "citizen") => {
        const mockUser: any = {
            id: crypto.randomUUID(),
            email,
            full_name: fullName || email.split('@')[0],
            role,
            points: 0,
            created_at: new Date().toISOString(),
        };
        setUser(mockUser);
        localStorage.setItem("mock_user", JSON.stringify(mockUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("mock_user");
        router.push("/login");
    };

    const updateUser = (updates: any) => {
        setUser((prev: any) => {
            const newUser = { ...prev, ...updates };
            localStorage.setItem("mock_user", JSON.stringify(newUser));
            return newUser;
        });
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUser }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
