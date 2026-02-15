"use client";

import { useTranslation } from "@/lib/translation-context";
import ProtectedRoute from "@/components/protected-route";
import { useAuth } from "@/lib/auth-context";
import {
    BarChart3,
    FileText,
    AlertTriangle,
    CheckCircle,
    Clock,
    ArrowUpRight,
    Download,
    Filter,
    Search,
    ChevronRight,
    CreditCard,
    DollarSign,
    Users
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function WardDashboard() {
    const { t } = useTranslation();
    const { user } = useAuth();

    const [reports, setReports] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Stats
    const [stats, setStats] = useState({
        active: 0,
        resolved: 0,
        pending: 0
    });

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await supabase
                .from('reports')
                .select('*')
                .order('timestamp', { ascending: false });

            if (fetchError) throw fetchError;

            if (data) {
                const fetchedReports = data.map((report: any) => ({
                    ...report,
                    date: report.timestamp ? new Date(report.timestamp).toLocaleDateString() : "Pending",
                    priority: report.priority || "Medium" // Default if missing
                }));

                setReports(fetchedReports);

                // Calculate stats
                const activeCount = fetchedReports.filter((r: any) => r.status?.toLowerCase() !== 'resolved').length;
                const resolvedCount = fetchedReports.filter((r: any) => r.status?.toLowerCase() === 'resolved').length;
                const pendingCount = fetchedReports.filter((r: any) => r.status?.toLowerCase() === 'open' || r.status?.toLowerCase() === 'pending').length;

                setStats({
                    active: activeCount,
                    resolved: resolvedCount,
                    pending: pendingCount
                });
            }
        } catch (err: any) {
            console.error("Error fetching ward reports:", err);
            setError(err.message || "Failed to load reports from Supabase.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="bg-blue-50/50 min-h-screen pb-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 space-y-12">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-tight animate-slide-up text-black">
                                Ward Dashboard
                            </h1>
                            <p className="text-lg text-black font-semibold mt-2 opacity-70 tracking-tight">
                                Management portal for Ward Heads • <span className="text-blue-600 font-black">Ward 5 Jurisdiction</span>
                            </p>
                        </div>
                        <div className="flex gap-3 animate-slide-up delay-100">
                            <button
                                onClick={fetchReports}
                                className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl font-black text-sm text-slate-900 shadow-sm hover:border-blue-200 transition-all"
                            >
                                <Clock className="w-4 h-4" />
                                Refresh Data
                            </button>
                            <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl font-black text-sm text-slate-900 shadow-sm hover:border-blue-200 transition-all">
                                <Download className="w-4 h-4" />
                                Export Reports
                            </button>
                        </div>
                    </div>

                    {/* Stats Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in delay-200 text-black">
                        {[
                            { label: "Active Reports", value: stats.active.toString(), icon: AlertTriangle, trend: "+12%", color: "text-amber-500", bg: "bg-amber-50" },
                            { label: "Resolved Today", value: stats.resolved.toString(), icon: CheckCircle, trend: "+5%", color: "text-emerald-500", bg: "bg-emerald-50" },
                            { label: "Pending Review", value: stats.pending.toString(), icon: Clock, trend: "-2%", color: "text-blue-500", bg: "bg-blue-50" },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-50 relative overflow-hidden group hover:scale-[1.02] transition-all">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50/50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
                                <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center mb-6`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <h3 className="text-sm font-black text-black uppercase tracking-widest opacity-40">{stat.label}</h3>
                                <div className="flex items-baseline gap-3 mt-1">
                                    <span className="text-4xl font-black tracking-tight">{stat.value}</span>
                                    <span className={`text-xs font-black ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>{stat.trend}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Main Content Area */}
                    <div className="bg-white rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.04)] border border-slate-50 overflow-hidden text-black">
                        {/* Tab Header (Fixed to Reports) */}
                        <div className="flex border-b border-slate-50 p-4">
                            <div className="px-8 py-4 rounded-2xl text-sm font-black tracking-widest uppercase bg-slate-900 text-white shadow-xl shadow-slate-200">
                                Active City Reports
                            </div>
                        </div>

                        {/* List Content */}
                        <div className="p-8">
                            <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                                <div className="relative flex-1">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                    <input
                                        type="text"
                                        placeholder="Search issue IDs, areas..."
                                        className="w-full h-14 pl-14 pr-6 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:outline-none focus:border-blue-200 transition-all font-bold"
                                    />
                                </div>
                                <button className="flex items-center gap-3 px-8 h-14 bg-white border-2 border-slate-100 rounded-2xl font-black text-sm hover:border-slate-200 transition-all">
                                    <Filter className="w-5 h-5" />
                                    Filter
                                </button>
                            </div>

                            {isLoading ? (
                                <div className="text-center py-20">
                                    <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                                    <p className="font-bold text-slate-400">Fetching reports from Supabase...</p>
                                </div>
                            ) : error ? (
                                <div className="text-center py-20 bg-red-50 rounded-[2rem] border-2 border-red-100">
                                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-black text-red-900">Connection Error</h3>
                                    <p className="text-red-600 font-bold mt-2">{error}</p>
                                    <button
                                        onClick={fetchReports}
                                        className="mt-6 px-8 py-3 bg-red-600 text-white rounded-xl font-black text-sm hover:bg-red-700 transition-colors"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            ) : reports.length === 0 ? (
                                <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                                    <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-black text-slate-900">No Reports Found</h3>
                                    <p className="text-slate-500 font-bold mt-2">There are currently no issues reported in Ward 5.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {reports.map((item: any, i) => (
                                        <div key={item.id} className="group flex items-center justify-between p-6 bg-white border-2 border-slate-50 rounded-[2rem] hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all animate-fade-in">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-slate-50 overflow-hidden">
                                                    {item.image_url ? (
                                                        <img src={item.image_url} alt="Issue" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <FileText className="w-6 h-6 text-slate-600" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-black tracking-tight">{item.type}</h4>
                                                    <div className="flex items-center gap-3 text-sm font-bold opacity-60">
                                                        <span>{item.id.toString().slice(0, 8)}...</span>
                                                        <span>•</span>
                                                        <span>{item.date}</span>
                                                        <span>•</span>
                                                        <span className="uppercase tracking-widest text-[10px] font-black">{item.location}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-8">
                                                <div className="text-right">
                                                    <div className="text-lg font-black">{item.priority}</div>
                                                    <div className={`text-[10px] font-black uppercase tracking-[0.2em] ${item.status?.toLowerCase() === 'resolved' ? 'text-emerald-500' :
                                                        item.status?.toLowerCase() === 'open' ? 'text-blue-500' : 'text-amber-500'
                                                        }`}>
                                                        {item.status}
                                                    </div>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                                                    <ChevronRight className="w-5 h-5 text-slate-900" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

function PlusIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}
