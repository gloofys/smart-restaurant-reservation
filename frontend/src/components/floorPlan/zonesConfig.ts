export type ZoneBox = {
    name: string
    x: number
    y: number
    width: number
    height: number
    color: string
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
    }
];