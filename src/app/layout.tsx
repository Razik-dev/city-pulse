import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TranslationProvider } from "@/lib/translation-context";
import { AuthProvider } from "@/lib/auth-context";
import Navbar from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "City Pulse",
    description: "Your city, your voice.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthProvider>
                    <TranslationProvider>
                        <div className="flex flex-col min-h-screen bg-white">
                            <Navbar />
                            <main className="flex-grow">
                                {children}
                            </main>
                        </div>
                    </TranslationProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
