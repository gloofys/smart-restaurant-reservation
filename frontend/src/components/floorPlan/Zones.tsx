import { ZONES } from "./zonesConfig";

export default function Zones() {
    return (
        <>
            {ZONES.map((zone) => {
                const isFeature = zone.kind === "FEATURE";

                return (
                    <div
                        key={zone.name}
                        className={[
                            "absolute rounded-lg pointer-events-none",
                            isFeature
                                ? "border-2 border-dashed border-yellow-400 bg-yellow-50/60"
                                : `border border-dashed border-gray-300 ${zone.color}/40`,
                        ].join(" ")}
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
                );
            })}
        </>
    );
}