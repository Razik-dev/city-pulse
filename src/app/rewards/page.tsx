"use client";

import { useTranslation } from "@/lib/translation-context";
import ProtectedRoute from "@/components/protected-route";
import { Award, Star, TreePine, Megaphone, CheckSquare, Trophy, User, Mail, History } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function Rewards() {
    const { t } = useTranslation();
    const { user } = useAuth();

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-blue-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">{t.nav.rewards}</h1>
                        <p className="text-xl text-black font-medium max-w-2xl mx-auto">Earn points for every good deed and contribute to a better city. Your impact matters.</p>
                    </div>

                    {/* Profile Section */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8 animate-fade-in">
                        <div className="w-20 h-20 bg-indigo-50 border-4 border-white shadow-sm rounded-full flex items-center justify-center text-indigo-600">
                            <User className="w-10 h-10" />
                        </div>
                        <div className="text-center md:text-left space-y-2">
                            <h2 className="text-2xl font-bold text-gray-900 capitalize tracking-tight">
                                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Guest User"}
                            </h2>
                            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 text-sm text-black font-bold">
                                <span className="flex items-center justify-center md:justify-start gap-2">
                                    <div className="p-1 bg-indigo-50 rounded-md">
                                        <Mail className="w-3.5 h-3.5 text-indigo-500" />
                                    </div>
                                    {user?.email}
                                </span>
                                <span className="hidden md:block text-gray-300">|</span>
                                <span className="px-3 py-1 bg-indigo-600 text-white rounded-full font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-600/20">
                                    Verified Resident
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* User Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 transform hover:-translate-y-1.5 transition-all duration-300">
                            <div className="flex items-center justify-between mb-6">
                                <Award className="w-10 h-10 text-indigo-100/50" />
                                <span className="text-xs font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">Level 5 Pioneer</span>
                            </div>
                            <p className="text-sm font-medium text-indigo-100 uppercase tracking-widest">Total Points</p>
                            <p className="text-5xl font-black mt-2 tracking-tight">{(user?.points || 0).toLocaleString()}</p>
                            <div className="mt-6 h-1 w-full bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white w-3/4 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                            </div>
                            <p className="text-xs mt-3 text-indigo-100 font-medium">550 pts to Level 6</p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:border-indigo-200 transition-all group hover:shadow-lg">
                            <div className="flex items-center gap-5 mb-4">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                    <Megaphone className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-gray-900 tracking-tight">12</p>
                                    <p className="text-sm font-black text-black uppercase tracking-wider">Issues Reported</p>
                                </div>
                            </div>
                            <div className="text-xs text-indigo-600 font-bold flex items-center gap-1">
                                <CheckSquare className="w-3 h-3" />
                                +2 this week
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:border-emerald-200 transition-all group hover:shadow-lg">
                            <div className="flex items-center gap-5 mb-4">
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                                    <CheckSquare className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-gray-900 tracking-tight">8</p>
                                    <p className="text-sm font-black text-black uppercase tracking-wider">Verified Fixes</p>
                                </div>
                            </div>
                            <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                High Impact Rate
                            </div>
                        </div>
                    </div>

                    {/* Earning History Table */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden shadow-slate-200/50">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-white">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Earning History</h2>
                                <p className="text-sm text-black font-bold">Detailed breakdown of your contributions</p>
                            </div>
                            <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors border border-gray-100">
                                <History className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-8 py-5 text-[11px] font-black text-black uppercase tracking-widest border-b border-gray-50">Activity Description</th>
                                        <th className="px-8 py-5 text-[11px] font-black text-black uppercase tracking-widest border-b border-gray-50">Date</th>
                                        <th className="px-8 py-5 text-[11px] font-black text-black uppercase tracking-widest border-b border-gray-50 text-right">Points</th>
                                        <th className="px-8 py-5 text-[11px] font-black text-black uppercase tracking-widest border-b border-gray-50 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {[
                                        { desc: "Pothole Reporting - Sector 14", date: "Oct 24, 2023", pts: "+50", status: "Verified" },
                                        { desc: "Street Light Fix Verification", date: "Oct 22, 2023", pts: "+30", status: "Verified" },
                                        { desc: "Community Cleanup Participation", date: "Oct 20, 2023", pts: "+200", status: "Pending" },
                                        { desc: "Garbage Dump Reporting", date: "Oct 18, 2023", pts: "+50", status: "Verified" },
                                        { desc: "Daily Login Streak", date: "Oct 17, 2023", pts: "+10", status: "Verified" },
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-all duration-200 group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                                        <Star className="w-5 h-5" />
                                                    </div>
                                                    <span className="font-bold text-gray-700 text-sm group-hover:text-indigo-600 transition-colors">{row.desc}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-sm text-gray-500 font-medium">{row.date}</td>
                                            <td className="px-8 py-5 text-sm font-black text-indigo-600 text-right tracking-tight">{row.pts}</td>
                                            <td className="px-8 py-5 text-center">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${row.status === 'Verified' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                                    {row.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-6 bg-slate-50/50 text-center">
                            <button className="text-xs font-black text-indigo-600 hover:text-indigo-700 hover:underline uppercase tracking-widest transition-all">
                                View Full Earning Statement
                            </button>
                        </div>
                    </div>

                    {/* Leaderboard Section */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden shadow-slate-200/50">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3 tracking-tight">
                                <div className="p-2 bg-amber-100 rounded-xl">
                                    <Trophy className="w-6 h-6 text-amber-600" />
                                </div>
                                City Hall of Fame
                            </h2>
                            <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest text-slate-500">Global Rank: #1,245</span>
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map((rank) => (
                                    <div key={rank} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-indigo-100 hover:bg-white transition-all group">
                                        <div className="flex items-center gap-5">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${rank === 1 ? 'bg-amber-400 text-white' : rank === 2 ? 'bg-slate-300 text-white' : rank === 3 ? 'bg-orange-400 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                {rank}
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-200 border-2 border-white shadow-sm overflow-hidden" />
                                                <span className="font-bold text-gray-700 group-hover:text-indigo-600 transition-colors">Elite Citizen {rank}</span>
                                            </div>
                                        </div>
                                        <span className="font-black text-indigo-600 tracking-tight">{5000 - (rank * 250)} <span className="text-[10px] text-indigo-400 font-bold">PTS</span></span>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-indigo-600 rounded-3xl p-8 text-white flex flex-col justify-center items-center text-center space-y-4 shadow-xl shadow-indigo-200">
                                <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20">
                                    <Star className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-black tracking-tight">Top 5% of Citizens</h3>
                                <p className="text-indigo-100 text-sm leading-relaxed">You've contributed more to city improvement than 95% of active residents this month!</p>
                                <button className="mt-4 px-8 py-3 bg-white text-indigo-600 font-black rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-[10px]">
                                    Share Achievement
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
