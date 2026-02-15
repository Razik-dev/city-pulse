"use client";

import { useTranslation } from "@/lib/translation-context";
import Link from "next/link";
import { ArrowRight, BarChart3, Cloud, FileText, Lightbulb, MapPin, Zap } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Reveal } from "@/components/reveal";

export default function Home() {
    const { t } = useTranslation();
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isAuthenticated && user?.role === "ward_head") {
            router.push("/ward-dashboard");
        }
    }, [isAuthenticated, user, router]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!heroRef.current) return;
        const rect = heroRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    const features = [
        {
            title: t.home.feature1Title,
            desc: t.home.feature1Desc,
            icon: Cloud,
            href: "/city-info",
            color: "bg-blue-50 text-blue-600",
        },
        {
            title: t.home.feature2Title,
            desc: t.home.feature2Desc,
            icon: MapPin,
            href: "/report-issues",
            color: "bg-red-50 text-red-600",
        },
        {
            title: t.home.feature3Title,
            desc: t.home.feature3Desc,
            icon: Zap,
            href: "/bill-payments",
            color: "bg-yellow-50 text-yellow-600",
        },
        {
            title: t.home.feature4Title,
            desc: t.home.feature4Desc,
            icon: Lightbulb,
            href: "/rewards",
            color: "bg-purple-50 text-purple-600",
        },
        {
            title: t.home.feature5Title,
            desc: t.home.feature5Desc,
            icon: BarChart3,
            href: "/analytics",
            color: "bg-green-50 text-green-600",
        },
        {
            title: t.home.feature6Title,
            desc: t.home.feature6Desc,
            icon: FileText,
            href: "/city-info",
            color: "bg-indigo-50 text-indigo-600",
        },
    ];

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            {/* Hero Section */}
            <Reveal>
                <section
                    ref={heroRef}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    className={`relative py-20 lg:py-32 overflow-hidden transition-colors duration-700 ease-in-out ${isHovering ? 'bg-white' : 'bg-[#FAF4E6]'}`}
                >
                    {/* Static Background Gradients */}
                    <div className={`absolute inset-0 -z-10 transition-opacity duration-700 ${isHovering ? 'opacity-0' : 'opacity-100'} bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-100/30 via-[#FAF4E6] to-white`}></div>

                    {/* Interactive Mouse-Follow Glow */}
                    <div
                        className={`absolute inset-0 -z-10 pointer-events-none transition-opacity duration-700 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
                        style={{
                            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.15), transparent 80%)`,
                        }}
                    ></div>

                    {/* Animated Floating Blurs */}
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-[120px] animate-pulse -z-10"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse delay-700 -z-10"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 animate-slide-up">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                                {t.home.heroTitle}
                            </span>
                        </h1>
                        <p className="text-3xl md:text-5xl font-bold text-blue-600 mb-8 animate-pulse tracking-wide drop-shadow-sm">
                            Your City, Your Pulse
                        </p>
                        <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-10 animate-fade-in delay-100">
                            {t.home.heroSubtitle}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-200">
                            <Link
                                href="/city-info"
                                className="inline-flex items-center justify-center px-8 py-4 text-base font-black text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 hover:shadow-xl hover:-translate-y-1 uppercase tracking-widest"
                            >
                                {t.home.learnMore}
                            </Link>
                        </div>
                    </div>
                </section>
            </Reveal>

            {/* Features Grid */}
            <Reveal delay={200}>
                <section className="py-20 bg-gray-50/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
                                {t.home.featuresTitle}
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                {t.home.featuresSubtitle}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <Reveal key={index} delay={(index % 3) * 100}>
                                    <Link
                                        href={feature.href}
                                        className="group p-8 bg-white rounded-[2.5rem] shadow-md hover:shadow-xl transition-all border-2 border-slate-100 hover:border-blue-200 hover:-translate-y-2 block h-full active:scale-[0.98]"
                                    >
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${feature.color} group-hover:scale-110 transition-transform`}>
                                            <feature.icon className="w-7 h-7" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {feature.desc}
                                        </p>
                                    </Link>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>
            </Reveal>
        </div>
    );
}
