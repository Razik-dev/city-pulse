"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("./map"), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-gray-100 rounded-2xl flex items-center justify-center animate-pulse">Loading Map...</div>
});

export default Map;
