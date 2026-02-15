"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/translation-context";
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Mail,
    Phone,
    MapPin,
    Github
} from "lucide-react";

export default function Footer() {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-white pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand & Mission */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <span className="text-white font-black text-xl">CP</span>
                            </div>
                            <span className="text-2xl font-black tracking-tighter">City Pulse</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed font-medium">
                            Empowering citizens to build smarter, safer, and more sustainable cities through technology and community engagement.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-blue-600 transition-colors group">
                                <Twitter className="w-5 h-5 text-slate-400 group-hover:text-white" />
                            </a>
                            <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-blue-600 transition-colors group">
                                <Facebook className="w-5 h-5 text-slate-400 group-hover:text-white" />
                            </a>
                            <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-blue-600 transition-colors group">
                                <Instagram className="w-5 h-5 text-slate-400 group-hover:text-white" />
                            </a>
                            <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-blue-600 transition-colors group">
                                <Linkedin className="w-5 h-5 text-slate-400 group-hover:text-white" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-blue-500 mb-8">Navigation</h4>
                        <ul className="space-y-4">
                            <li><Link href="/" className="text-slate-400 hover:text-white transition-colors font-bold text-sm">Home</Link></li>
                            <li><Link href="/city-info" className="text-slate-400 hover:text-white transition-colors font-bold text-sm">City Info</Link></li>
                            <li><Link href="/report-issues" className="text-slate-400 hover:text-white transition-colors font-bold text-sm">Report Issues</Link></li>
                            <li><Link href="/bill-payments" className="text-slate-400 hover:text-white transition-colors font-bold text-sm">Bill Payments</Link></li>
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-blue-500 mb-8">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
                                <span className="text-slate-400 text-sm font-medium">123 City Hall Plaza, Digital District, Metropolis 560001</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                                <span className="text-slate-400 text-sm font-medium">+91 (80) 2222-3333</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                                <span className="text-slate-400 text-sm font-medium">support@citypulse.gov.in</span>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-blue-500 mb-8">Legal</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-bold text-sm">Privacy Policy</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-bold text-sm">Terms & Conditions</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-bold text-sm">Cookies Settings</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-bold text-sm">Accessibility</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                        © {currentYear} City Pulse. Built for the citizens.
                    </p>
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">All Systems Operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
