"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/translation-context";
import { useAuth } from "@/lib/auth-context";
import { Globe, Menu, X, LogOut, UserCircle } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const { t, lang, setLang } = useTranslation();
    const { isAuthenticated, user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggleMenu = () => setIsOpen(!isOpen);

    // Only show these items if authenticated (or maybe show them but they redirect to login)
    // For better UX, let's show them but reliance is on ProtectedRoute to block access.
    // However, visually hiding them reduces clutter for new users.
    // Let's hide feature links if not logged in, per standard "Get Started" flow.
    const navItems = isAuthenticated ? [
        { href: "/", label: t.nav.home },
        { href: "/city-info", label: t.nav.cityInfo },
        { href: "/report-issues", label: t.nav.reportIssues },
        { href: "/bill-payments", label: t.nav.billPayments },
        { href: "/rewards", label: t.nav.rewards },
        { href: "/analytics", label: t.nav.analytics },
    ] : [
        { href: "/", label: t.nav.home }, // Public Home
    ];

    const handleLangChange = () => {
        setLang(lang === "en" ? "kn" : "en");
    };

    return (
        <nav className="bg-blue-50 sticky top-0 z-50 border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center gap-3 group">
                            <div className="relative w-10 h-10 overflow-hidden transition-transform transform group-hover:scale-105">
                                {/* Auto-detects logo.png in public folder. If not found, it falls back to icon. 
                                    Using specific img tag for local file to avoid Next.js Image config complexity for now, 
                                    though Next.js Image is preferred for production. */}
                                <img src="/logo.svg" alt="City Pulse Logo" className="w-full h-full object-contain" onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }} />
                                {/* Fallback Icon */}
                                <div className="hidden w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-md">
                                    <span className="text-white font-bold text-xl">CP</span>
                                </div>
                            </div>
                            <span className="font-bold text-2xl text-primary tracking-tight group-hover:text-blue-700 transition-colors">City Pulse</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-blue-50",
                                    pathname === item.href
                                        ? "text-primary bg-blue-50"
                                        : "text-gray-600 hover:text-primary"
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <button
                            onClick={handleLangChange}
                            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors flex items-center gap-1"
                            title="Change Language"
                        >
                            <Globe className="w-5 h-5" />
                            <span className="text-sm font-medium uppercase">{lang}</span>
                        </button>

                        {isAuthenticated ? (
                            <button
                                onClick={logout}
                                className="ml-4 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                {t.nav.logout}
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="ml-4 px-6 py-2 rounded-full bg-primary text-black hover:bg-primary/90 text-sm font-medium transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                {t.nav.login}
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={handleLangChange}
                            className="p-2 mr-2 rounded-full hover:bg-gray-100 text-gray-600"
                        >
                            <span className="text-sm font-bold uppercase">{lang}</span>
                        </button>
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                        >
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden animate-fade-in bg-white border-b">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "block px-3 py-2 rounded-md text-base font-medium",
                                    pathname === item.href
                                        ? "text-primary bg-blue-50"
                                        : "text-gray-600 hover:text-primary hover:bg-gray-50"
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                        {isAuthenticated ? (
                            <button
                                onClick={() => { logout(); setIsOpen(false); }}
                                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                            >
                                {t.nav.logout}
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-primary hover:text-primary-dark hover:bg-gray-50"
                            >
                                {t.nav.login}
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
