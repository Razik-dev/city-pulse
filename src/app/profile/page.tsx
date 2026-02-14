"use client";

import { useTranslation } from "@/lib/translation-context";
import ProtectedRoute from "@/components/protected-route";
import { UserCircle, Award, MapPin, Calendar, Edit2, Shield, Clock } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Profile() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [userReports, setUserReports] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchProfileAndReports();
        }
    }, [user]);

    const fetchProfileAndReports = async () => {
        setIsLoading(true);
        try {
            // Fetch Profile
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user?.id)
                .single();

            if (profileError) console.error("Error fetching profile:", profileError);
            setProfile(profileData);

            // Fetch Reports
            const { data: reportsData, error: reportsError } = await supabase
                .from('reports')
                .select('*')
                .eq('user_id', user?.id)
                .order('timestamp', { ascending: false });

            if (reportsError) throw reportsError;
            setUserReports(reportsData || []);

        } catch (error) {
            console.error("Error loading profile data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <ProtectedRoute>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </ProtectedRoute>
        );
    }

    const userData = {
        name: profile?.full_name || user?.email?.split('@')[0] || "User",
        email: user?.email || "No email",
        id: user?.id?.substring(0, 8).toUpperCase() || "N/A",
        joined: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "N/A",
        points: (userReports.length * 50), // Sample point logic
        level: userReports.length > 5 ? "Community Hero" : "Contributor",
        reports: userReports.map(r => ({
            id: r.id,
            type: r.type,
            location: r.location,
            date: new Date(r.timestamp).toLocaleDateString(),
            status: r.status,
            color: r.status === "Resolved" ? "text-green-600 bg-green-50" : "text-blue-600 bg-blue-50"
        }))
    };

    return (
        <ProtectedRoute>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <UserCircle className="w-12 h-12" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{userData.name}</h1>
                            <div className="flex items-center gap-4 text-gray-500 mt-1">
                                <span className="flex items-center gap-1 text-sm"><Shield className="w-4 h-4" /> {userData.id}</span>
                                <span className="flex items-center gap-1 text-sm"><Calendar className="w-4 h-4" /> {t.profile.joined} {userData.joined}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-primary to-blue-700 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-blue-100 font-medium">{t.profile.totalPoints}</span>
                                <Award className="w-6 h-6 text-yellow-300" />
                            </div>
                            <div className="text-4xl font-bold mb-1">{userData.points}</div>
                            <div className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                                {userData.level}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">{t.profile.personalInfo}</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Email</label>
                                    <p className="text-gray-900 font-medium">{userData.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">{t.profile.recentActivity}</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {userData.reports.length > 0 ? (
                                userData.reports.map((report) => (
                                    <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-gray-100 rounded-lg">
                                                <Clock className="w-6 h-6 text-gray-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-base font-bold text-gray-900">{report.type}</h4>
                                                <p className="text-sm text-gray-500">{report.location}</p>
                                                <p className="text-xs text-gray-400 mt-1">{report.date}</p>
                                            </div>
                                        </div>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium self-start sm:self-center ${report.color}`}>
                                            {report.status}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    {t.profile.noReports}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
