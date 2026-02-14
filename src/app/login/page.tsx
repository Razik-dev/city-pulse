"use client";

import { useTranslation } from "@/lib/translation-context";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, AlertTriangle, CheckCircle } from "lucide-react";

export default function Login() {
    const { t } = useTranslation();
    const { login } = useAuth();
    const router = useRouter();

    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Form States
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setIsLoading(true);

        console.log("Mock Auth Attempt:", { email, hasPassword: !!password });

        try {
            // Mock delay to simulate network request
            await new Promise(resolve => setTimeout(resolve, 800));

            // Any email/password is valid in Mock Mode
            login(email, fullName);

            setSuccessMessage(isLogin ? "Welcome back!" : "Account created successfully!");

            // Redirect after a short delay
            setTimeout(() => {
                router.push("/");
            }, 500);
        } catch (err: any) {
            console.error("Auth Error Detail:", err);
            setError("An error occurred during authentication.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100 animate-fade-in">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                        {isLogin ? t.login.title : t.login.createAccount}
                    </h2>
                    <p className="text-sm text-gray-600">
                        {isLogin ? t.login.subtitle : t.login.createSubtitle}
                    </p>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-start gap-3 animate-shake">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {successMessage && (
                    <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        <p>{successMessage}</p>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                    {t.login.fullName}
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                        className="block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                                        placeholder={t.login.fullName}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                {t.login.email}
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                                    placeholder="user@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                {t.login.password}
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
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end">
                        <div className="text-sm">
                            {isLogin ? (
                                <a href="#" className="font-medium text-primary hover:text-primary/80">
                                    {t.login.forgotPassword}
                                </a>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsLogin(true)}
                                    className="px-3 py-1 rounded-md border border-primary text-primary hover:bg-primary/5 font-medium transition-colors"
                                >
                                    Login to your account
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors uppercase tracking-wide cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Processing..." : (isLogin ? "Login Now" : "Create Account")}
                        </button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                        >
                            {isLogin ? "Create new account" : "Log in to existing account"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
