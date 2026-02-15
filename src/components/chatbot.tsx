"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";

type Message = {
    text: string;
    sender: "user" | "bot";
    timestamp: Date;
};

// Knowledge Base (matching your backend logic)
const kb = {
    login: "To login: Click 'Login' on the top right → Enter username/email and password → Click 'Sign In'. New user? Click 'Sign Up' and fill details.",
    signup: "To create an account: Click 'Sign Up' → Enter Name, Email, Password → Confirm Password → Submit.",
    navigation: "Use the navbar to go to: City Info, Report Issues, Bill Payments, Rewards, Analytics, Profile.",
    reportIssue: "To report an issue: Go to 'Report Issues' → Fill in issue type, location, description → Attach image if needed → Submit. You'll earn reward points!",
    cityInfo: "City Info: Check AQI updates, transport status, waste collection schedules, local events. Navigate to 'City Info' section.",
    billPayment: "To pay your bills: Go to 'Bill Payments' → Select Bill Type (Water/Electricity/Property Tax) → Enter Details → Pay Online.",
    rewards: "Rewards: Go to 'Rewards' → Check earned points → Redeem points → View available offers and vouchers.",
    analytics: "Analytics: Go to 'Analytics' → View city statistics, trends, and insights about various civic services.",
    faq: "For FAQs: Ask me anything! Examples: 'How to report?', 'How to pay bills?', 'What are rewards?'",
    contactSupport: "Contact Support: You can reach out through the app or email support@citypulse.com for assistance."
};

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            text: "Hi! I'm your CityPulse assistant. How can I help you today?",
            sender: "bot",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const getBotReply = (message: string): string => {
        const msg = message.toLowerCase();

        if (msg.includes("login")) return kb.login;
        if (msg.includes("sign up") || msg.includes("register")) return kb.signup;
        if (msg.includes("navigate") || msg.includes("navigation")) return kb.navigation;
        if (msg.includes("report")) return kb.reportIssue;
        if (msg.includes("city info") || msg.includes("city")) return kb.cityInfo;
        if (msg.includes("bill") || msg.includes("payment")) return kb.billPayment;
        if (msg.includes("reward")) return kb.rewards;
        if (msg.includes("analytics") || msg.includes("chart") || msg.includes("graph")) return kb.analytics;
        if (msg.includes("faq")) return kb.faq;
        if (msg.includes("support") || msg.includes("contact")) return kb.contactSupport;

        return "I'm here to help! You can ask me about: login, sign up, navigation, reporting issues, city info, bill payments, rewards, analytics, or contact support.";
    };

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            text: input,
            sender: "user",
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");

        // Simulate bot typing delay
        setTimeout(() => {
            const botReply: Message = {
                text: getBotReply(input),
                sender: "bot",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botReply]);
        }, 500);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Floating Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-slate-900 to-slate-700 text-white rounded-full shadow-2xl hover:shadow-slate-500/50 hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center group"
                aria-label="Open chat"
            >
                {isOpen ? (
                    <X className="w-7 h-7" />
                ) : (
                    <MessageCircle className="w-7 h-7 group-hover:animate-bounce" />
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-96 h-[32rem] bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border-2 border-slate-100 animate-slide-up">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white p-6 rounded-t-3xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <MessageCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-black text-lg">CityPulse Assistant</h3>
                                <p className="text-xs text-white/70">Always here to help</p>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${msg.sender === "user"
                                            ? "bg-blue-600 text-white rounded-br-sm"
                                            : "bg-white text-slate-800 rounded-bl-sm shadow-sm border border-slate-100"
                                        }`}
                                >
                                    <p className="text-sm leading-relaxed">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-slate-100">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                            <button
                                onClick={handleSend}
                                className="w-12 h-12 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center shadow-lg shadow-blue-500/20"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
