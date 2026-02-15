"use client";

import { useTranslation } from "@/lib/translation-context";
import ProtectedRoute from "@/components/protected-route";
import { useAuth } from "@/lib/auth-context";
import { Camera, MapPin, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ReportIssues() {
    const { t } = useTranslation();
    const { user } = useAuth();
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);
        }
    };

    // Clean up preview URL on unmount
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
                // Ensure image_url maps to the expected key if different
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

        try {
            setSubmitError(null);

            // Validate connection before submitting
            const { error: pingError } = await supabase.from('reports').select('id').limit(1);
            if (pingError) throw new Error("Could not connect to Supabase database. Please ensure your 'reports' table exists and RLS policies are set.");

            const form = e.target as HTMLFormElement;
            const typeValue = (form.elements.namedItem("type") as HTMLSelectElement).value;
            const descriptionValue = (form.elements.namedItem("description") as HTMLTextAreaElement).value;

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

            const { error: insertError } = await supabase
                .from('reports')
                .insert([
                    {
                        user_id: user?.id, // Link report to the logged-in user
                        type: typeValue,
                        location,
                        description: descriptionValue,
                        image_url: imageUrl,
                        status: "Open",
                        timestamp: new Date().toISOString(),
                    }
                ]);

            if (insertError) throw insertError;

            // Show success message
            setShowSuccess(true);
            form.reset();
            setFile(null);
            setPreviewUrl(null);
            setLocation("");
        } catch (error: any) {
            console.error("Supabase Submission Error:", error);
            const errorMessage = error?.message || "Unknown error";
            setSubmitError(`Submission Failed: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status?.toLowerCase()) {
            case "resolved":
                return "bg-green-100 text-green-800";
            case "in progress":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-yellow-100 text-yellow-800";
        }
    };

    const getIconForType = (type: string) => {
        switch (type?.toLowerCase()) {
            case "pothole": return AlertTriangle;
            case "street light": return Clock;
            case "garbage": return AlertTriangle;
            default: return CheckCircle;
        }
    };

    return (
        <div className="bg-blue-50/50 min-h-screen pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="text-center mb-12">
                    {connectionStatus === "checking" && (
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-xs font-bold mb-4 border border-gray-100">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                            Connecting to Supabase...
                        </div>
                    )}
                    {connectionStatus === "connected" && (
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold mb-4 border border-blue-100 animate-bounce">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            Supabase Connected ⚡
                        </div>
                    )}
                    {connectionStatus === "error" && (
                        <div className="flex flex-col items-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold mb-2 border border-red-100">
                                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                Supabase Offline (Check Table 'reports')
                            </div>
                            <button onClick={checkConnection} className="text-[10px] text-blue-600 font-bold hover:underline mb-4">Retry Connection</button>
                        </div>
                    )}
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.nav.reportIssues}</h1>
                    <p className="text-xl text-gray-600">Help us make your neighborhood better by reporting issues.</p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="bg-gray-100 p-1 rounded-xl inline-flex">
                        <button
                            onClick={() => setActiveTab("report")}
                            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "report"
                                ? "bg-white text-primary shadow-sm"
                                : "text-gray-500 hover:text-gray-900"
                                }`}
                        >
                            Report New Issue
                        </button>
                        <button
                            onClick={() => setActiveTab("status")}
                            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "status"
                                ? "bg-white text-primary shadow-sm"
                                : "text-gray-500 hover:text-gray-900"
                                }`}
                        >
                            Track Status
                        </button>
                    </div>
                </div>

                {activeTab === "report" ? (
                    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
                        {showSuccess ? (
                            <div className="text-center py-10 space-y-6">
                                <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-4">
                                    <CheckCircle className="w-12 h-12 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Successfully Submitted!</h3>
                                <p className="text-gray-600">Your issue has been reported. You can track its status in the "Track Status" tab.</p>
                                <div className="flex flex-col gap-3 pt-4">
                                    <button
                                        onClick={() => setShowSuccess(false)}
                                        className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                                    >
                                        Report Another Issue
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("status")}
                                        className="w-full py-3 px-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                                    >
                                        Track My Reports
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                                        Issue Type
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="type"
                                            name="type"
                                            className="block w-full pl-3 pr-10 py-3 text-base border-black focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-lg"
                                            defaultValue="Pothole"
                                        >
                                            <option>Pothole</option>
                                            <option>Street Light</option>
                                            <option>Garbage</option>
                                            <option>Water Leakage</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                        Location
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm flex gap-2">
                                        <div className="relative flex-grow">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <MapPin className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                name="location"
                                                id="location"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-black rounded-lg py-3"
                                                placeholder="Enter location or pin on map"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleGetLocation}
                                            disabled={isLocating}
                                            className="inline-flex items-center px-4 py-2 border border-black shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                                        >
                                            {isLocating ? "..." : <MapPin className="h-5 w-5 text-blue-600" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <div className="mt-1">
                                        <textarea
                                            id="description"
                                            name="description"
                                            rows={4}
                                            className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-black rounded-lg p-3"
                                            placeholder="Describe the issue in detail..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo</label>
                                    <label htmlFor="file-upload" className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-black border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer w-full overflow-hidden">
                                        <div className="space-y-1 text-center">
                                            {previewUrl ? (
                                                <div className="relative group">
                                                    <img src={previewUrl} alt="Preview" className="mx-auto h-48 w-full object-cover rounded-lg" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                                        <p className="text-white font-medium">Change Photo</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <Camera className="mx-auto h-12 w-12 text-gray-400" />
                                                    <div className="flex text-sm text-gray-600 justify-center">
                                                        <span className="relative bg-transparent rounded-md font-bold text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                                            <span>Upload a file</span>
                                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                                                        </span>
                                                        <p className="pl-1">or drag and drop</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                                </>
                                            )}
                                            {/* Hidden input needs to stay outside or be repeated if we want to change it */}
                                            {previewUrl && <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />}
                                        </div>
                                    </label>
                                </div>

                                <div>
                                    {submitError && (
                                        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-start gap-3 animate-shake">
                                            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                            <p>{submitError}</p>
                                        </div>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/30 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? "Submitting..." : "Submit Report"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                        {isLoadingReports ? (
                            <div className="text-center py-20 text-gray-500">Loading reports...</div>
                        ) : reports.length === 0 ? (
                            <div className="text-center py-20 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200 flex flex-col items-center gap-2">
                                <Clock className="w-8 h-8 text-gray-300" />
                                <p>No reports found. Submit your first issue!</p>
                            </div>
                        ) : (
                            reports.map((report) => {
                                const Icon = getIconForType(report.type);
                                return (
                                    <div
                                        key={report.id}
                                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all"
                                    >
                                        <div className="flex items-start space-x-4">
                                            <div className={`p-3 rounded-lg ${report.imageUrl ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'}`}>
                                                {report.imageUrl ? (
                                                    <img src={report.imageUrl} alt="Report" className="w-12 h-12 object-cover rounded-lg" />
                                                ) : (
                                                    <Icon className="w-6 h-6" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">{report.type}</h3>
                                                <p className="text-gray-500">{report.location}</p>
                                                <p className="text-xs text-gray-400 mt-1">{report.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusStyles(report.status)}`}
                                            >
                                                {report.status}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
