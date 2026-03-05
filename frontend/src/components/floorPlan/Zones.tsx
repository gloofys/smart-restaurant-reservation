import { ZONES } from "./zonesConfig";

export default function Zones() {
    return (
        <>
            {ZONES.map((zone) => (
                <div
                    key={zone.name}
                    className={`absolute border border-dashed border-gray-300 rounded-lg pointer-events-none ${zone.color}/40`}
                    style={{
                        left: zone.x,
                        top: zone.y,
                        width: zone.width,
                        height: zone.height,
                    }}
                >


                    <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm font-semibold select-none">
                        {zone.name}
                    </div>
                </div>
            ))}
        </>
    );
}