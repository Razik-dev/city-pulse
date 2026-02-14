"use client";

import { useTranslation } from "@/lib/translation-context";
import ProtectedRoute from "@/components/protected-route";
import { Zap, Droplets, Flame, Wifi, History, Download, CreditCard } from "lucide-react";
import { useState } from "react";

export default function BillPayments() {
    const { t } = useTranslation();
    const [selectedBill, setSelectedBill] = useState<string | null>(null);

    const bills = [
        { id: "electricity", name: "Electricity", icon: Zap, color: "bg-yellow-100 text-yellow-600", amount: "1,450.00" },
        { id: "water", name: "Water", icon: Droplets, color: "bg-blue-100 text-blue-600", amount: "450.00" },
        { id: "gas", name: "Gas", icon: Flame, color: "bg-red-100 text-red-600", amount: "850.00" },
        { id: "internet", name: "Internet", icon: Wifi, color: "bg-purple-100 text-purple-600", amount: "999.00" },
    ];

    return (
        <ProtectedRoute>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.billPayments.title}</h1>
                    <p className="text-xl text-gray-600">{t.billPayments.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Bill Selection */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {bills.map((bill) => (
                            <div
                                key={bill.id}
                                onClick={() => setSelectedBill(bill.id)}
                                className={`cursor-pointer p-6 rounded-2xl shadow-sm border transition-all ${selectedBill === bill.id
                                    ? "border-primary ring-2 ring-primary ring-opacity-50 bg-primary/5"
                                    : "border-gray-100 bg-white hover:border-primary/30 hover:shadow-md"
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bill.color}`}>
                                        <bill.icon className="w-6 h-6" />
                                    </div>
                                    <span className="text-2xl font-bold">₹{bill.amount}</span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">{bill.name}</h3>
                                <p className="text-sm text-gray-500">Due in 5 days</p>
                            </div>
                        ))}
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 h-fit">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Details</h2>
                        <div className="space-y-6 animate-fade-in">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-500">Bill Type</label>
                                <p className="font-semibold text-gray-900 h-6">
                                    {selectedBill ? bills.find((b) => b.id === selectedBill)?.name : <span className="text-gray-300">Select a bill...</span>}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-500">Account Number</label>
                                <input
                                    type="text"
                                    disabled={!selectedBill}
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:cursor-not-allowed"
                                    placeholder="XXXXXXXXXX"
                                />
                            </div>
                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-gray-600">Amount</span>
                                    <span className={`text-2xl font-bold ${selectedBill ? 'text-primary' : 'text-gray-300'}`}>
                                        ₹{selectedBill ? bills.find((b) => b.id === selectedBill)?.amount : "0.00"}
                                    </span>
                                </div>

                                <div className={`mb-6 flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300 transition-all ${selectedBill ? 'opacity-100' : 'opacity-50 blur-sm'}`}>
                                    <p className="text-sm text-gray-500 mb-2">Scan to Pay</p>
                                    <img src="/qr-placeholder.svg" alt="Payment QR Code" className="w-32 h-32" />
                                </div>

                                <button
                                    disabled={!selectedBill}
                                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
                                >
                                    <CreditCard className="w-5 h-5" />
                                    Pay Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
