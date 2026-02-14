"use client";

import { useTranslation } from "@/lib/translation-context";
import ProtectedRoute from "@/components/protected-route";
import { Award, Star, TreePine, Megaphone, CheckSquare, Trophy } from "lucide-react";

export default function Rewards() {
    const { t } = useTranslation();

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-green-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.nav.rewards}</h1>
                        <p className="text-xl text-gray-600">Earn points for every good deed and contribute to a better city.</p>
                    </div>

                    {/* User Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg transform hover:-translate-y-1 transition-transform">
                            <div className="flex items-center justify-between mb-4">
                                <Award className="w-8 h-8 opacity-80" />
                                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded-lg">Level 5</span>
                            </div>
                            <p className="text-sm opacity-90">Total Points</p>
                            <p className="text-4xl font-bold mt-1">2,450</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-primary/30 transition-colors">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <Megaphone className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">12</p>
                                    <p className="text-sm text-gray-500">Issues Reported</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-primary/30 transition-colors">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                    <CheckSquare className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">8</p>
                                    <p className="text-sm text-gray-500">Verified Fixes</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Leaderboard Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-yellow-500" />
                                City Board
                            </h2>
                        </div>
                        <div className="p-6">
                            {/* Mock Leaderboard */}
                            {[1, 2, 3, 4, 5].map((rank) => (
                                <div key={rank} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${rank === 1 ? 'bg-yellow-100 text-yellow-700' : rank === 2 ? 'bg-gray-100 text-gray-700' : rank === 3 ? 'bg-orange-100 text-orange-700' : 'bg-white text-gray-500'}`}>
                                            {rank}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200" />
                                            <span className="font-medium text-gray-900">User {rank}</span>
                                        </div>
                                    </div>
                                    <span className="font-bold text-primary">{5000 - (rank * 250)} pts</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
