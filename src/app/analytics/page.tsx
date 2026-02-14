"use client";

import { useTranslation } from "@/lib/translation-context";
import ProtectedRoute from "@/components/protected-route";
import { BarChart3, TrendingUp, AlertOctagon, CheckCircle2 } from "lucide-react";

export default function Analytics() {
    const { t } = useTranslation();

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-blue-50 -my-10 py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.nav.analytics}</h1>
                        <p className="text-xl text-gray-600">Insights and trends on city performance.</p>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
                            <div className="flex items-center justify-between text-gray-500">
                                <span className="text-sm font-medium">Total Issues</span>
                                <BarChart3 className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-3xl font-bold text-gray-900">1,248</span>
                                <span className="ml-2 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
                            <div className="flex items-center justify-between text-gray-500">
                                <span className="text-sm font-medium">Resolved</span>
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-3xl font-bold text-green-600">892</span>
                                <span className="ml-2 text-xs font-medium text-gray-400">71% Rate</span>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
                            <div className="flex items-center justify-between text-gray-500">
                                <span className="text-sm font-medium">Pending</span>
                                <AlertOctagon className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-3xl font-bold text-orange-500">356</span>
                                <span className="ml-2 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">+5%</span>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
                            <div className="flex items-center justify-between text-gray-500">
                                <span className="text-sm font-medium">City Score</span>
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-3xl font-bold text-blue-600">8.4</span>
                                <span className="ml-2 text-xs font-medium text-gray-400">/ 10</span>
                            </div>
                        </div>
                    </div>

                    {/* Charts Section Placeholder */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-80 flex items-center justify-center">
                            <p className="text-gray-400">Monthly Trends Chart Placeholder</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-80 flex items-center justify-center">
                            <p className="text-gray-400">Issue Distribution Chart Placeholder</p>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
