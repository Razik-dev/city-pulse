"use client";

import { useTranslation } from "@/lib/translation-context";
import ProtectedRoute from "@/components/protected-route";
import { useAuth } from "@/lib/auth-context";
import { Camera, MapPin, AlertTriangle, CheckCircle, Clock, Upload, FileText, Info, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Reveal } from "@/components/reveal";

export default function ReportIssues() {
    const { t } = useTranslation();
    const { user, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState<"report" | "status">("report");
    const [location, setLocation] = useState("");
    const [isLocating, setIsLocating] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const [reports, setReports] = useState<any[]>([]);
    const [isLoadingReports, setIsLoadingReports] = useState(false);

    // Missing state from previous corrupted edit
    const [issueType, setIssueType] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState({ text: "", type: "" });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);
        }
    };

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    useEffect(() => {
        if (activeTab === "status") {
            fetchReports();
        }
    }, [activeTab]);

    const fetchReports = async () => {
        setIsLoadingReports(true);
        try {
            const { data, error } = await supabase
                .from('reports')
                .select('*')
                .order('timestamp', { ascending: false });

            if (error) throw error;

            const fetchedReports = data.map((report: any) => ({
                ...report,
                date: report.timestamp ? new Date(report.timestamp).toLocaleDateString() : "Pending",
                imageUrl: report.image_url
            }));
            setReports(fetchedReports);
        } catch (error) {
            console.error("Error fetching reports:", error);
        } finally {
            setIsLoadingReports(false);
        }
    };

    const handleGetLocation = () => {
        setIsLocating(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                    setIsLocating(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setIsLocating(false);
                    alert("Could not get your location. Please enter it manually.");
                }
            );
        } else {
            setIsLocating(false);
            alert("Geolocation is not supported by your browser.");
        }
    };

    const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "error">("checking");

    useEffect(() => {
        checkConnection();
    }, []);

    const checkConnection = async () => {
        setConnectionStatus("checking");
        try {
            const { error } = await supabase.from('reports').select('id').limit(1);
            if (error) throw error;
            setConnectionStatus("connected");
        } catch (error) {
            console.error("Supabase Connection Error:", error);
            setConnectionStatus("error");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);
        setMessage({ text: "", type: "" });

        try {
            const { error: pingError } = await supabase.from('reports').select('id').limit(1);
            if (pingError) throw new Error("Could not connect to Supabase database.");

            let imageUrl = "";
            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                const filePath = `reports/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('reports')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('reports')
                    .getPublicUrl(filePath);

                imageUrl = publicUrl;
            }

            // Award random points (1-10)
            const earnedPoints = Math.floor(Math.random() * 10) + 1;
            const currentPoints = user?.points || 0;

            const { error: insertError } = await supabase
                .from('reports')
                .insert([
                    {
                        user_id: user?.id,
                        type: issueType || "Other",
                        location,
                        description,
                        image_url: imageUrl,
                        status: "Open",
                        timestamp: new Date().toISOString(),
                        reward_points: earnedPoints, // Store points in reports table
                    }
                ]);

            if (insertError) throw insertError;

            // Sync points with profiles table
            // Attempt to use RPC for atomic increment, fallback to update if RPC not found or fails
            await supabase.rpc('increment_points', {
                user_id: user?.id,
                amount: earnedPoints
            }).catch(async (err: any) => {
                console.warn("RPC increment_points failed, falling back to direct update:", err);
                await supabase.from('profiles')
                    .update({ points: currentPoints + earnedPoints })
                    .eq('id', user?.id)
                    .catch((updateErr: any) => console.error("Profile update error:", updateErr));
            });

            updateUser({ points: currentPoints + earnedPoints }); // Update local user context

            setShowSuccess(true);
            setMessage({
                text: t.reportIssues.submitSuccess ?
                    `${t.reportIssues.submitSuccess} Points Earned: +${earnedPoints}` :
                    `Report submitted successfully! You earned +${earnedPoints} points!`,
                type: "success"
            });
            setIssueType("");
            setDescription("");
            setFile(null);
            setPreviewUrl(null);
            setLocation("");
        } catch (error: any) {
            console.error("Supabase Submission Error:", error);
            setSubmitError(error?.message || "Submission Failed");
            setMessage({ text: error?.message || "Submission Failed", type: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status?.toLowerCase()) {
            case "resolved": return "bg-green-100 text-green-800";
            case "in progress": return "bg-blue-100 text-blue-800";
            default: return "bg-yellow-100 text-yellow-800";
        }
    };

    return (
        <ProtectedRoute>
            <div className="bg-blue-50/50 min-h-screen pb-20">
                <Reveal>
                    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 space-y-12">
                        {/* Header Section */}
                        <div className="text-center md:text-left space-y-4">
                            {connectionStatus === "connected" && (
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold mb-4 border border-blue-100">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                    Supabase Online
                                </div>
                            )}
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
                                {t.reportIssues.title}
                            </h1>
                            <p className="text-lg text-slate-600 font-medium">
                                {t.reportIssues.subtitle}
                            </p>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="flex flex-wrap gap-4 p-2 bg-white rounded-3xl shadow-sm border border-slate-100 w-fit mx-auto md:mx-0">
                            <button
                                onClick={() => setActiveTab("report")}
                                className={`px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === "report"
                                    ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                                    }`}
                            >
                                {t.reportIssues.newReport}
                            </button>
                            <button
                                onClick={() => setActiveTab("status")}
                                className={`px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === "status"
                                    ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                                    }`}
                            >
                                {t.reportIssues.myReports}
                            </button>
                        </div>

                        {activeTab === "report" ? (
                            <Reveal delay={100}>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-10">
                                        {showSuccess ? (
                                            <div className="text-center py-10 space-y-6">
                                                <div className="inline-flex items-center justify-center p-6 bg-emerald-100 rounded-full mb-4">
                                                    <CheckCircle className="w-12 h-12 text-emerald-600" />
                                                </div>
                                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Report Received!</h3>
                                                <p className="text-slate-500 font-medium">We've logged your issue and notified the Ward Head.</p>
                                                <button
                                                    onClick={() => setShowSuccess(false)}
                                                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:-translate-y-1 transition-all"
                                                >
                                                    Report Another
                                                </button>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleSubmit} className="space-y-8">
                                                <div className="space-y-6">
                                                    <div className="space-y-2">
                                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Issue Type</label>
                                                        <select
                                                            value={issueType}
                                                            onChange={(e) => setIssueType(e.target.value)}
                                                            required
                                                            className="w-full px-6 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all font-bold appearance-none shadow-sm"
                                                        >
                                                            <option value="">Select an issue...</option>
                                                            <option value="Garbage">{t.reportIssues.garbage}</option>
                                                            <option value="Street Light">{t.reportIssues.brokenLight}</option>
                                                            <option value="Pothole">{t.reportIssues.pothole}</option>
                                                            <option value="Water Leakage">{t.reportIssues.waterLeakage}</option>
                                                            <option value="Other">{t.reportIssues.other}</option>
                                                        </select>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Location</label>
                                                        <div className="flex gap-2">
                                                            <div className="relative flex-grow">
                                                                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                                                <input
                                                                    type="text"
                                                                    value={location}
                                                                    onChange={(e) => setLocation(e.target.value)}
                                                                    placeholder="e.g. 5th Main, Ward 5"
                                                                    required
                                                                    className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all font-bold shadow-sm"
                                                                />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={handleGetLocation}
                                                                className="px-4 bg-slate-100 rounded-2xl hover:bg-blue-50 text-blue-600 transition-colors"
                                                            >
                                                                {isLocating ? "..." : <MapPin className="w-5 h-5" />}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                                                        <textarea
                                                            value={description}
                                                            onChange={(e) => setDescription(e.target.value)}
                                                            rows={4}
                                                            required
                                                            className="w-full px-6 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all font-bold resize-none shadow-sm"
                                                            placeholder="Details of the issue..."
                                                        ></textarea>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Photo Attachment</label>
                                                        <label
                                                            htmlFor="file-upload-new"
                                                            className="flex flex-col items-center justify-center w-full min-h-[8rem] bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl hover:bg-slate-100 hover:border-blue-200 transition-all cursor-pointer group overflow-hidden"
                                                        >
                                                            {previewUrl ? (
                                                                <img src={previewUrl} alt="Preview" className="w-full h-32 object-cover" />
                                                            ) : (
                                                                <div className="flex flex-col items-center py-4">
                                                                    <Camera className="w-8 h-8 text-slate-300 group-hover:text-blue-500 mb-2" />
                                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tap to upload</p>
                                                                </div>
                                                            )}
                                                            <input id="file-upload-new" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                                        </label>
                                                    </div>
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-1 transition-all disabled:opacity-50 relative overflow-hidden group"
                                                >
                                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                                        {isSubmitting ? (
                                                            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                        ) : (
                                                            <>
                                                                <Upload className="w-6 h-6" />
                                                                {t.reportIssues.submit}
                                                            </>
                                                        )}
                                                    </span>
                                                </button>
                                            </form>
                                        )}
                                    </div>

                                    {/* Panels */}
                                    <div className="space-y-8 lg:pt-10">
                                        <div className="bg-slate-900 p-10 rounded-[3rem] text-white space-y-6 relative overflow-hidden">
                                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px] -mb-32 -mr-32"></div>
                                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                                                <Shield className="w-7 h-7 text-emerald-400" />
                                            </div>
                                            <h3 className="text-2xl font-black tracking-tight">Citizen Power</h3>
                                            <p className="text-white/60 font-medium leading-relaxed">Your reports directly alert officials. Join thousands of citizens making our city better.</p>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        ) : (
                            <Reveal delay={100}>
                                <div className="space-y-6">
                                    {isLoadingReports ? (
                                        <div className="text-center py-20">
                                            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    ) : reports.length === 0 ? (
                                        <div className="text-center py-32 bg-white rounded-[4rem] shadow-sm border border-slate-100 flex flex-col items-center space-y-6">
                                            <FileText className="w-16 h-16 text-slate-100" />
                                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">No Reports Yet</h3>
                                            <button onClick={() => setActiveTab("report")} className="text-blue-600 font-bold hover:underline">Start Reporting</button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {reports.map((report) => (
                                                <div key={report.id} className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden">
                                                                {report.imageUrl ? (
                                                                    <img src={report.imageUrl} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <FileText className="w-6 h-6 text-slate-200" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <h4 className="text-lg font-black text-slate-900 tracking-tight">{report.type}</h4>
                                                                <div className="text-xs font-bold text-slate-400">{report.location}</div>
                                                            </div>
                                                        </div>
                                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyles(report.status)}`}>
                                                            {report.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-600 font-medium line-clamp-2 md:line-clamp-none">{report.description}</p>
                                                    <div className="mt-6 pt-6 border-t border-slate-50 text-[10px] font-black text-slate-300 uppercase tracking-widest">{report.date}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Reveal>
                        )}
                    </div>
                </Reveal>
            </div>
        </ProtectedRoute>
    );
}
