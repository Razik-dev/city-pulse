"use client";

import { useTranslation } from "@/lib/translation-context";
import ProtectedRoute from "@/components/protected-route";
import DynamicMap from "@/components/dynamic-map";
import { CloudRain, Wind, Thermometer, Droplets, Map, Bus, Building2, Shield, HeartPulse, CarTaxiFront } from "lucide-react";

export default function CityInfo() {
    const { t } = useTranslation();

    return (
        <ProtectedRoute>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.cityInfo.title}</h1>
                    <p className="text-xl text-gray-600">{t.cityInfo.subtitle}</p>
                </div>

                {/* Weather & AQI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center animate-fade-in delay-100">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
                            <Thermometer className="w-6 h-6" />
                        </div>
                        <p className="text-gray-500 text-sm">{t.cityInfo.temperature}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">28°C</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center animate-fade-in delay-200">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                            <Wind className="w-6 h-6" />
                        </div>
                        <p className="text-gray-500 text-sm">{t.cityInfo.aqi}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">45 <span className="text-sm font-normal text-green-600">({t.cityInfo.good})</span></p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center animate-fade-in delay-300">
                        <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-4 text-cyan-600">
                            <Droplets className="w-6 h-6" />
                        </div>
                        <p className="text-gray-500 text-sm">{t.cityInfo.humidity}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">65%</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center animate-fade-in delay-400">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 text-purple-600">
                            <CloudRain className="w-6 h-6" />
                        </div>
                        <p className="text-gray-500 text-sm">{t.cityInfo.weather}</p>
                        <p className="text-xl font-bold text-gray-900 mt-2">Partly Cloudy</p>
                    </div>
                </div>

                {/* Live Map Section */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">Live City Map</h2>
                    <div className="bg-gray-100 rounded-2xl shadow-inner border border-gray-200 h-[400px] w-full overflow-hidden relative z-0">
                        <DynamicMap />
                    </div>
                </div>

                {/* Transport Section */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Public Transport</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start space-x-4 hover:shadow-md transition-shadow">
                            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
                                <Bus className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Bus Stands</h3>
                                <p className="text-sm text-gray-500 mt-1">Central Bus Stand (Majestic), Shantinagar, Satellite Stand</p>
                                <div className="mt-2 text-xs text-blue-600 font-medium">Located on map</div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start space-x-4 hover:shadow-md transition-shadow">
                            <div className="p-3 bg-black/5 text-black rounded-lg">
                                <CarTaxiFront className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Taxi Stands</h3>
                                <p className="text-sm text-gray-500 mt-1">Airport Taxi, City Taxi Stand (MG Road), Rly Station Cab Zone</p>
                                <div className="mt-2 text-xs text-blue-600 font-medium">Located on map</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Public Facilities */}
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
            </div>
        </ProtectedRoute>
    );
}
