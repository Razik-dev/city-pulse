"use client";

import { useTranslation } from "@/lib/translation-context";
import ProtectedRoute from "@/components/protected-route";
import DynamicMap from "@/components/dynamic-map";
import { CloudRain, Wind, Thermometer, Droplets, Map, Bus, Building2, Shield, HeartPulse, CarTaxiFront, Search, Navigation2, X, ChevronRight } from "lucide-react";
import { useState } from "react";
import { transportData, AreaTransport, TransportStand } from "@/lib/bus-stands";
import { Reveal } from "@/components/reveal";

export default function CityInfo() {
    const { t } = useTranslation();
    const [selectedArea, setSelectedArea] = useState<string>(transportData[0].area);
    const [modalType, setModalType] = useState<'bus' | 'taxi' | null>(null);

    const currentAreaInfo = transportData.find(a => a.area === selectedArea);
    const currentStands = modalType === 'bus' ? currentAreaInfo?.busStands : currentAreaInfo?.taxiStands;

    return (
        <ProtectedRoute>
            <div className="bg-blue-50/50 min-h-screen pb-20">
                <Reveal>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.cityInfo.title}</h1>
                            <p className="text-xl text-gray-600">{t.cityInfo.subtitle}</p>
                        </div>

                        {/* Weather & AQI Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { icon: Thermometer, title: t.cityInfo.temperature, val: "28°C", color: "text-blue-600", bg: "bg-blue-100", delay: 100 },
                                { icon: Wind, title: t.cityInfo.aqi, val: `45 (${t.cityInfo.good})`, color: "text-green-600", bg: "bg-green-100", delay: 200 },
                                { icon: Droplets, title: t.cityInfo.humidity, val: "65%", color: "text-cyan-600", bg: "bg-cyan-100", delay: 300 },
                                { icon: CloudRain, title: t.cityInfo.weather, val: "Partly Cloudy", color: "text-purple-600", bg: "bg-purple-100", delay: 400 },
                            ].map((item, idx) => (
                                <Reveal key={idx} delay={item.delay}>
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                                        <div className={`w-12 h-12 ${item.bg} rounded-full flex items-center justify-center mb-4 ${item.color}`}>
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <p className="text-gray-500 text-sm">{item.title}</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-1">{item.val}</p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>

                        {/* Live Map Section */}
                        <Reveal delay={200}>
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-gray-900">Live City Map</h2>
                                <div className="bg-gray-100 rounded-2xl shadow-inner border border-gray-200 h-[400px] w-full overflow-hidden relative z-0">
                                    <DynamicMap />
                                </div>
                            </div>
                        </Reveal>

                        {/* Transport Section */}
                        <Reveal delay={300}>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Public Transport</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div
                                        onClick={() => setModalType('bus')}
                                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start space-x-4 hover:shadow-md transition-all cursor-pointer group"
                                    >
                                        <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg group-hover:bg-yellow-100 transition-colors">
                                            <Bus className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-bold text-gray-900">Bus Stands</h3>
                                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Current Area: <span className="font-semibold text-gray-700">{selectedArea}</span>
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1 truncate max-w-[200px]">
                                                {currentAreaInfo?.busStands[0]?.name}, {currentAreaInfo?.busStands[1]?.name}...
                                            </p>
                                            <div className="mt-2 text-xs text-blue-600 font-medium">Click to change area</div>
                                        </div>
                                    </div>

                                    <div
                                        onClick={() => setModalType('taxi')}
                                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start space-x-4 hover:shadow-md transition-all cursor-pointer group"
                                    >
                                        <div className="p-3 bg-black/5 text-black rounded-lg group-hover:bg-black/10 transition-colors">
                                            <CarTaxiFront className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-bold text-gray-900">Taxi Stands</h3>
                                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Current Area: <span className="font-semibold text-gray-700">{selectedArea}</span>
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1 truncate max-w-[200px]">
                                                {currentAreaInfo?.taxiStands[0]?.name}, {currentAreaInfo?.taxiStands[1]?.name}...
                                            </p>
                                            <div className="mt-2 text-xs text-blue-600 font-medium">Click to change area</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Reveal>

                        {/* Public Facilities */}
                        <Reveal delay={400}>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.cityInfo.facilities}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start space-x-4 hover:shadow-md transition-shadow">
                                        <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                                            <HeartPulse className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{t.cityInfo.hospitals}</h3>
                                            <p className="text-sm text-gray-500 mt-1">City General, Apollo, Manipal</p>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start space-x-4 hover:shadow-md transition-shadow">
                                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                            <Shield className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{t.cityInfo.policeStations}</h3>
                                            <p className="text-sm text-gray-500 mt-1">Central Station, North Zone, Traffic HQ</p>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start space-x-4 hover:shadow-md transition-shadow">
                                        <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                                            <Building2 className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{t.cityInfo.parks}</h3>
                                            <p className="text-sm text-gray-500 mt-1">Cubbon Park, Lalbagh, Freedom Park</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Reveal>

                        {/* Transport Locator Modal */}
                        {modalType && (
                            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                                <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                                    <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                                {modalType === 'bus' ? <Bus className="w-5 h-5 text-yellow-600" /> : <CarTaxiFront className="w-5 h-5 text-black" />}
                                                {modalType === 'bus' ? 'Bus Stand Locator' : 'Taxi Stand Locator'}
                                            </h2>
                                            <p className="text-sm text-gray-500">Find transport in your area</p>
                                        </div>
                                        <button
                                            onClick={() => setModalType(null)}
                                            className="p-2 hover:bg-white rounded-full transition-colors shadow-sm"
                                        >
                                            <X className="w-5 h-5 text-gray-500" />
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                        {/* Area Selector */}
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                                <Navigation2 className="w-4 h-4 text-primary" />
                                                Select Your Current Area
                                            </label>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                {transportData.map((area: AreaTransport) => (
                                                    <button
                                                        key={area.area}
                                                        onClick={() => setSelectedArea(area.area)}
                                                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${selectedArea === area.area
                                                            ? "bg-primary text-black shadow-lg shadow-primary/20 scale-105"
                                                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                                            }`}
                                                    >
                                                        {area.area}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Stands List */}
                                        <div className="space-y-4">
                                            <h3 className="text-base font-bold text-gray-900 border-l-4 border-yellow-500 pl-3">
                                                Major {modalType === 'bus' ? 'Bus' : 'Taxi'} Stands in {selectedArea}
                                            </h3>
                                            <div className="space-y-3">
                                                {currentStands?.map((stand: TransportStand, i: number) => (
                                                    <div key={i} className="bg-white border border-gray-100 p-4 rounded-2xl hover:border-primary/50 transition-colors group">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">{stand.name}</p>
                                                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                                    <Map className="w-3 h-3 text-gray-400" />
                                                                    {stand.location}
                                                                </p>
                                                            </div>
                                                            <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-0.5 rounded">Active</span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                                            {stand.details.map((detail: string, j: number) => (
                                                                <span key={j} className="text-[11px] font-bold bg-gray-100 text-gray-700 px-2 py-1 rounded-lg border border-gray-200">
                                                                    {detail}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-gray-50/50 border-t border-gray-100">
                                        <button
                                            onClick={() => setModalType(null)}
                                            className="w-full py-4 bg-primary text-black font-bold rounded-2xl hover:shadow-lg hover:shadow-primary/20 transition-all transform active:scale-[0.98]"
                                        >
                                            View on Map
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Reveal>
            </div>
        </ProtectedRoute>
    );
}
