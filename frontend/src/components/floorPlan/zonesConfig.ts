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
        x: 40,
        y: 60,
        width: 420,
        height: 320,
        color: "bg-blue-50"
    },
    {
        name: "Terrace",
        x: 480,
        y: 60,
        width: 260,
        height: 200,
        color: "bg-green-50"
    },
    {
        name: "Private Room",
        x: 480,
        y: 280,
        width: 260,
        height: 200,
        color: "bg-purple-50"
    }
];