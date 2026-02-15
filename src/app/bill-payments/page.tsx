"use client";

import { useTranslation } from "@/lib/translation-context";
import ProtectedRoute from "@/components/protected-route";
import { Zap, Droplets, Flame, Wifi, History, Download, CreditCard, Award, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

export default function BillPayments() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [selectedBill, setSelectedBill] = useState<string | null>(null);
    const [rewardPoints, setRewardPoints] = useState(0);

    useEffect(() => {
        if (user) {
            fetchRewardPoints();
        }
    }, [user]);

    const fetchRewardPoints = async () => {
        try {
            const { count, error } = await supabase
                .from('reports')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user?.id);

            if (error) throw error;
            setRewardPoints((count || 0) * 50);
        } catch (error) {
            console.error("Error fetching points:", error);
        }
    };

    const bills = [
        { id: "electricity", name: "Electricity", icon: Zap, color: "bg-yellow-100 text-yellow-600", amount: "1,450.00" },
        { id: "water", name: "Water", icon: Droplets, color: "bg-blue-100 text-blue-600", amount: "450.00" },
        { id: "gas", name: "Gas", icon: Flame, color: "bg-red-100 text-red-600", amount: "850.00" },
        { id: "internet", name: "Internet", icon: Wifi, color: "bg-purple-100 text-purple-600", amount: "999.00" },
    ];

    const selectedBillData = bills.find((b) => b.id === selectedBill);
    const rawAmount = selectedBillData ? parseFloat(selectedBillData.amount.replace(',', '')) : 0;
    const discount = rewardPoints >= 1000 ? 5 : 0;
    const finalAmount = Math.max(0, rawAmount - discount);

    return (
        <ProtectedRoute>
            <div className="bg-blue-50/50 min-h-screen selection:bg-cyan-100 selection:text-cyan-900">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-20 space-y-16">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tighter leading-tight animate-slide-up">
                            {t.billPayments.title}
                        </h1>
                        <p className="text-xl text-black font-semibold tracking-tight border-l-4 border-cyan-500 pl-6 animate-slide-up delay-100">
                            {t.billPayments.subtitle}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
                        {/* Modern Bento Grid for Bill Selection */}
                        <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[160px]">
                            {bills.map((bill, index) => (
                                <div
                                    key={bill.id}
                                    onClick={() => setSelectedBill(bill.id)}
                                    className={`relative group cursor-pointer p-6 rounded-[2rem] border transition-all duration-500 overflow-hidden flex flex-col justify-between ${selectedBill === bill.id
                                        ? "bg-slate-900 border-slate-900 shadow-[0_20px_50px_rgba(15,23,42,0.3)] xl:col-span-2 xl:row-span-2"
                                        : "bg-white border-slate-100 hover:border-cyan-200 hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
                                        } ${index === 0 && !selectedBill ? "xl:col-span-2 xl:row-span-2" : ""}`}
                                >
                                    {/* Glass Highlight on Selection */}
                                    {selectedBill === bill.id && (
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[60px] rounded-full -mr-10 -mt-10" />
                                    )}

                                    <div className="flex items-start justify-between">
                                        <div className={`p-4 rounded-2xl transition-all duration-500 ${selectedBill === bill.id
                                            ? "bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/20"
                                            : "bg-slate-50 text-slate-600 group-hover:bg-cyan-50 group-hover:text-cyan-600"
                                            }`}>
                                            <bill.icon className="w-6 h-6" />
                                        </div>
                                        <div className={`text-sm font-black tracking-widest uppercase transition-colors ${selectedBill === bill.id ? "text-white" : "text-black/60"
                                            }`}>
                                            Auto-Pay
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className={`text-xl font-black mb-1 tracking-tight transition-colors ${selectedBill === bill.id ? "text-white" : "text-slate-900"
                                            }`}>{bill.name}</h3>
                                        <div className={`flex items-baseline gap-2 transition-colors ${selectedBill === bill.id ? "text-white" : "text-black"
                                            }`}>
                                            <span className="text-2xl font-black">₹{bill.amount}</span>
                                            <span className="text-xs font-bold opacity-60 uppercase tracking-widest">Due</span>
                                        </div>
                                    </div>

                                    {/* Subtle hover indicator */}
                                    <div className={`absolute bottom-6 right-6 p-2 rounded-full transition-all duration-500 opacity-0 group-hover:opacity-100 ${selectedBill === bill.id ? "bg-cyan-500 text-slate-900" : "bg-slate-900 text-white"
                                        }`}>
                                        <History className="w-4 h-4" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Floating Modern Sidebar */}
                        <div className="xl:col-span-4 sticky top-24">
                            <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_30px_100px_rgba(0,0,0,0.08)] border border-slate-50 flex flex-col gap-10">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Checkout</h2>
                                    <p className="text-sm font-black text-black uppercase tracking-[0.2em]">Transaction Secure</p>
                                </div>

                                <div className="space-y-8">
                                    <div className="group relative">
                                        <label className="absolute -top-3 left-6 px-2 bg-white text-[10px] font-black text-cyan-600 uppercase tracking-widest transition-all group-focus-within:text-slate-900">
                                            Account Reference
                                        </label>
                                        <input
                                            type="text"
                                            disabled={!selectedBill}
                                            className="w-full h-16 px-6 bg-slate-50/50 border-2 border-slate-100 rounded-2xl text-lg font-bold text-slate-900 focus:outline-none focus:border-cyan-500 focus:bg-white transition-all disabled:opacity-30 placeholder-slate-300"
                                            placeholder="Enter ID: 123-456-789"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center px-2">
                                            <span className="text-sm font-bold text-black uppercase tracking-widest">Selected Bill</span>
                                            <span className="text-sm font-black text-black">
                                                {selectedBill ? bills.find((b) => b.id === selectedBill)?.name : "---"}
                                            </span>
                                        </div>

                                        <div className="p-8 bg-slate-900 rounded-3xl space-y-6 shadow-2xl shadow-slate-200">
                                            <div className="flex justify-between items-center">
                                                <span className="text-black font-bold text-sm">Subtotal</span>
                                                <span className="text-white font-black">₹{rawAmount.toFixed(2)}</span>
                                            </div>

                                            {discount > 0 && (
                                                <div className="flex justify-between items-center p-4 bg-cyan-400/10 rounded-2xl border border-cyan-400/20">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                                                            <Award className="w-5 h-5 text-slate-900" />
                                                        </div>
                                                        <span className="text-cyan-400 text-xs font-black uppercase tracking-widest">Citizen Rewards</span>
                                                    </div>
                                                    <span className="text-cyan-400 font-black">-₹{discount.toFixed(2)}</span>
                                                </div>
                                            )}

                                            <div className="pt-6 border-t border-slate-800 flex justify-between items-end">
                                                <div className="space-y-1">
                                                    <span className="block text-black text-[10px] font-black uppercase tracking-[0.2em]">Total Due</span>
                                                    <div className="flex items-center gap-2 text-cyan-400 text-[10px] font-black uppercase tracking-widest">
                                                        <Star className="w-3 h-3 fill-current" />
                                                        {rewardPoints} Reward Balance
                                                    </div>
                                                </div>
                                                <span className={`text-4xl font-black tracking-tighter transition-all ${selectedBill ? 'text-white' : 'text-slate-700'}`}>
                                                    ₹{finalAmount.toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`relative flex flex-col items-center justify-center p-8 bg-white rounded-3xl border-2 border-dashed border-slate-100 transition-all duration-500 ${selectedBill ? 'opacity-100' : 'opacity-20 blur-sm scale-95'}`}>
                                        <div className="absolute -top-3 px-3 bg-white text-[10px] font-black text-black uppercase tracking-[0.2em]">Scan to Pay</div>
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700" />
                                            <img src="/qr-placeholder.svg" alt="Payment QR Code" className="relative w-32 h-32 opacity-80 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>

                                    <button
                                        disabled={!selectedBill}
                                        className="w-full h-20 bg-slate-900 group relative rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] active:scale-95 disabled:bg-slate-100 disabled:shadow-none disabled:cursor-not-allowed"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                                        <div className="relative flex items-center justify-center gap-4 text-white font-black uppercase tracking-[0.2em] group-hover:text-slate-900 transition-colors">
                                            <CreditCard className="w-6 h-6" />
                                            <span>Authorize Payment</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
