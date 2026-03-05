export type ZoneBox = {
    name: string
    x: number
    y: number
    width: number
    height: number
    color: string
    kind?: "ZONE" | "FEATURE"
}

export const ZONES: ZoneBox[] = [
    {
        name: "Main Hall",
        x: 60,
        y: 60,
        width: 360,
        height: 380,
        color: "bg-blue-50"
    },
    {
        name: "Terrace",
        x: 480,
        y: 60,
        width: 260,
        height: 220,
        color: "bg-green-50"
    },
    {
        name: "Private Room",
        x: 480,
        y: 300,
        width: 320,
        height: 200,
        color: "bg-purple-50"
    },
    {   name: "Play Area",
        x: 70,
        y: 470,
        width: 140,
        height: 110,
        color: "bg-yellow-50",
        kind: "FEATURE" },
];