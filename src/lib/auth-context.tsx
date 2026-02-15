"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

type AuthContextType = {
    isAuthenticated: boolean;
    user: (User & { role?: string }) | null;
    login: (email: string, fullName?: string, role?: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    user: null,
    login: () => { },
    logout: () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Mock Auth: Check localStorage for a persistent mock session (optional)
        const savedUser = localStorage.getItem("mock_user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = (email: string, fullName?: string, role: string = "citizen") => {
        const mockUser: any = {
            id: "MOCK-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
            email,
            full_name: fullName || email.split('@')[0],
            role,
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

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
