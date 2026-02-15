"use client";

import { useTranslation } from "@/lib/translation-context";
import Link from "next/link";
import { ArrowRight, BarChart3, Cloud, FileText, Lightbulb, MapPin, Zap } from "lucide-react";

export default function Home() {
    const { t } = useTranslation();

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
            <section className="relative py-20 lg:py-32 overflow-hidden bg-blue-50/30">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 via-blue-50/50 to-white"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
                            href="/login"
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-black bg-primary rounded-full hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                        >
                            {t.home.getStarted}
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                        <Link
                            href="/city-info"
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-all shadow-sm hover:shadow"
                        >
                            {t.home.learnMore}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
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
                            <Link
                                key={index}
                                href={feature.href}
                                className="group p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-primary/20 hover:-translate-y-1 block h-full"
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
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
