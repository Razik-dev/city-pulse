"use client";

import { useTranslation } from "@/lib/translation-context";
import { useAuth } from "@/lib/auth-context";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, AlertTriangle, CheckCircle, User, ShieldCheck } from "lucide-react";

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
    const [role, setRole] = useState("citizen");

    // Animation States
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const { innerWidth, innerHeight } = window;
            const x = (e.clientX / innerWidth) * 100;
            const y = (e.clientY / innerHeight) * 100;
            setMousePos({ x, y });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

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
            login(email, fullName, role);

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
        <div
            ref={containerRef}
            className="relative flex items-center justify-center min-h-[calc(100vh-4rem)] overflow-hidden py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 transition-colors duration-1000"
            style={{
                background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.15) 25%, rgba(0, 0, 0, 0) 50%),
                             radial-gradient(circle at ${100 - mousePos.x}% ${100 - mousePos.y}%, rgba(236, 72, 153, 0.1) 0%, rgba(6, 182, 212, 0.1) 25%, rgba(0, 0, 0, 0) 50%)`
            }}
        >
            {/* Animated Background Blobs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            <div className="w-full max-w-md space-y-8 backdrop-blur-3xl bg-white/80 p-10 rounded-[2.5rem] shadow-2xl border border-white/40 animate-fade-in relative z-10">
                <div className="text-center">
                    <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">
                        {isLogin ? t.login.title : t.login.createAccount}
                    </h2>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em]">
                        {isLogin ? t.login.subtitle : t.login.createSubtitle}
                    </p>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-200 rounded-2xl text-sm flex items-start gap-3 animate-shake">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                {successMessage && (
                    <div className="p-4 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-200 rounded-2xl text-sm flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="font-medium">{successMessage}</p>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 mb-2">
                            <button
                                type="button"
                                onClick={() => setRole("citizen")}
                                className={`py-3 px-4 rounded-xl border-2 transition-all font-black text-xs uppercase tracking-widest ${role === "citizen"
                                    ? "border-slate-400 bg-slate-400/10 text-slate-700 shadow-[0_0_20px_rgba(148,163,184,0.2)]"
                                    : "border-slate-100 bg-slate-50/50 text-slate-400 hover:border-slate-200"
                                    }`}
                            >
                                Citizen
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole("ward_head")}
                                className={`py-3 px-4 rounded-xl border-2 transition-all font-black text-xs uppercase tracking-widest ${role === "ward_head"
                                    ? "border-slate-400 bg-slate-400/10 text-slate-700 shadow-[0_0_20px_rgba(148,163,184,0.2)]"
                                    : "border-slate-100 bg-slate-50/50 text-slate-400 hover:border-slate-200"
                                    }`}
                            >
                                Ward Head
                            </button>
                        </div>

                        {!isLogin && (
                            <div className="space-y-1">
                                <label htmlFor="fullName" className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                                    {t.login.fullName}
                                </label>
                                <div className="mt-1 relative rounded-2xl overflow-hidden group border border-slate-200 shadow-sm transition-all focus-within:shadow-md focus-within:border-blue-500/50">
                                    <input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                        className="block w-full px-6 py-4 bg-white border-none text-slate-900 placeholder-slate-400 focus:outline-none transition-all font-medium"
                                        placeholder={t.login.fullName}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label htmlFor="email" className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                                {t.login.email}
                            </label>
                            <div className="mt-1 relative rounded-2xl overflow-hidden group border border-slate-200 shadow-sm transition-all focus-within:shadow-md focus-within:border-blue-500/50">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="block w-full pl-12 pr-6 py-4 bg-white border-none text-slate-900 placeholder-slate-400 focus:outline-none transition-all font-medium"
                                    placeholder="user@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="password" className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                                {t.login.password}
                            </label>
                            <div className="mt-1 relative rounded-2xl overflow-hidden group border border-slate-200 shadow-sm transition-all focus-within:shadow-md focus-within:border-blue-500/50">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="block w-full pl-12 pr-6 py-4 bg-white border-none text-slate-900 placeholder-slate-400 focus:outline-none transition-all font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end">
                        <div className="text-xs">
                            {isLogin && (
                                <a href="#" className="font-black text-blue-400 hover:text-blue-300 uppercase tracking-widest transition-colors">
                                    {t.login.forgotPassword}
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full group relative flex justify-center py-5 px-4 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(59,130,246,0.3)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:from-blue-500 group-hover:to-indigo-500 transition-all" />
                            <span className="relative text-base font-black text-white uppercase tracking-[0.2em]">
                                {isLoading ? "Processing..." : (isLogin ? "Authenticate" : "Create Account")}
                            </span>
                        </button>
                    </div>
                </form>

                <div className="mt-8 space-y-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                            <span className="px-2 bg-white/50 text-slate-400">Secure Connection</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="w-full flex justify-center py-4 px-4 border border-slate-100 rounded-xl shadow-sm text-xs font-black text-slate-600 uppercase tracking-widest bg-white/50 hover:bg-white/80 focus:outline-none transition-all"
                        >
                            {isLogin ? "Join City Pulse" : "Back to Login"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
