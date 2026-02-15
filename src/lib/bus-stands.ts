export interface TransportStand {
    name: string;
    location: string;
    details: string[]; // Bus numbers or Taxi types
}

export interface AreaTransport {
    area: string;
    busStands: TransportStand[];
    taxiStands: TransportStand[];
}

export const transportData: AreaTransport[] = [
    {
        area: "Majestic (Central)",
        busStands: [
            { name: "KSRTC Terminal 1", location: "Opposite Railway Station", details: ["K1", "K2", "201", "301"] },
            { name: "BMTC Platform 1-10", location: "Majestic Circle", details: ["V-335E", "500C", "G-3"] },
        ],
        taxiStands: [
            { name: "Railway Station Taxi Zone", location: "Main Exit Gate", details: ["Airport Taxi", "City Cabs", "Auto Rickshaws"] },
            { name: "Majestic Metro Taxi Stand", location: "Exit 3", details: ["Ola/Uber Pickup", "Prepaid Taxi"] }
        ]
    },
    {
        area: "Indiranagar",
        busStands: [
            { name: "Indiranagar 100ft Road Stand", location: "Near Metro Station", details: ["201", "K-1", "V-335E"] },
        ],
        taxiStands: [
            { name: "100ft Road Taxi Stand", location: "Near KFC Junction", details: ["City Cabs", "Auto Stand"] },
            { name: "CMH Road Auto Stand", location: "Metro Pillar 120", details: ["24/7 Auto Service"] }
        ]
    },
    {
        area: "Koramangala",
        busStands: [
            { name: "Sony World Signal Stand", location: "80ft Road", details: ["342", "343", "V-500C"] },
        ],
        taxiStands: [
            { name: "Sony World Taxi Hub", location: "Near Sony World Signal", details: ["Premium Cabs", "Airport Drop"] },
            { name: "80ft Road Auto Stand", location: "Near Maharaja Restaurant", details: ["Local Autos"] }
        ]
    },
    {
        area: "MG Road",
        busStands: [
            { name: "MG Road Metro Stand", location: "Near Trinity Circle", details: ["G-1", "SBS-2", "333"] },
        ],
        taxiStands: [
            { name: "Brigade Road Taxi Stand", location: "Entrance of Brigade Road", details: ["Night Service", "City Cabs"] },
            { name: "Cauvery Emporium Auto Stand", location: "MG Road", details: ["Prepaid Terminal"] }
        ]
    },
    {
        area: "Whitefield",
        busStands: [
            { name: "ITPL Bus Stand", location: "Inside ITPL Park", details: ["500", "V-335E", "333"] },
        ],
        taxiStands: [
            { name: "ITPL Main Gate Taxi Stand", location: "Gate 1", details: ["Corporate Cabs", "Airport Shuttle"] },
            { name: "Hope Farm Auto Stand", location: "Hope Farm Junction", details: ["Local Link Autos"] }
        ]
    }
];
