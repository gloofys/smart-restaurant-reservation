import type { Table } from "../../types/table";

type Props = {
    table: Table;
    occupied: boolean;
    recommended: boolean;
    selected?: boolean;
    dimmed?: boolean;
    onSelect?: () => void;
};

function getDims(capacity: number) {
    if (capacity <= 2) return { w: 46, h: 46, shape: "round" as const };
    if (capacity <= 4) return { w: 58, h: 58, shape: "square" as const };
    if (capacity <= 6) return { w: 78, h: 58, shape: "rect" as const };
    return { w: 90, h: 66, shape: "rect" as const };
}

export default function TableNode({
                                      table,
                                      occupied,
                                      recommended,
                                      selected,
                                      dimmed,
                                      onSelect,
                                  }: Props) {
    const { w, h, shape } = getDims(table.capacity);

    const ring = selected
        ? "ring-4 ring-blue-500 border-blue-500 shadow-xl z-20"
        : recommended
            ? "ring-2 ring-green-500"
            : occupied
                ? "ring-2 ring-red-500"
                : "ring-1 ring-gray-200";

    const bg = occupied ? "bg-gray-50" : "bg-white";
    const cursor = occupied || dimmed ? "cursor-not-allowed" : "cursor-pointer";

    const opacity = dimmed ? "opacity-20" : occupied ? "opacity-70" : "opacity-100";
    const blur = dimmed ? "blur-[1px]" : "";
    const scale = selected ? "scale-110" : recommended ? "scale-105" : "scale-100";

    const radius =
        shape === "round" ? "9999px" : shape === "square" ? "14px" : "16px";

    return (
        <button
            type="button"
            disabled={occupied || dimmed}
            onClick={onSelect}
            className={`absolute ${cursor} ${opacity} ${bg} ${blur} ${ring} ${scale} border border-gray-200 transition-all duration-200 hover:shadow-md`}
            style={{
                left: table.x,
                top: table.y,
                width: w,
                height: h,
                borderRadius: radius,
                transform: "translate(-50%, -50%)",
            }}
            title={`T${table.id} • ${table.capacity} seats • ${table.zone}`}
        >
            <div className="flex h-full w-full flex-col items-center justify-center leading-tight">
                <div className="text-[10px] font-semibold text-gray-500">T{table.id}</div>
                <div className="text-sm font-bold text-gray-900">{table.capacity}</div>
            </div>

            {selected ? (
                <div className="absolute -top-2 -right-2 rounded-full bg-blue-600 text-white text-[10px] px-2 py-0.5 shadow">
                    Selected
                </div>
            ) : recommended && !occupied ? (
                <div className="absolute -top-2 -right-2 rounded-full bg-green-600 text-white text-[10px] px-2 py-0.5 shadow">
                    Best
                </div>
            ) : occupied ? (
                <div className="absolute -top-2 -right-2 rounded-full bg-red-600 text-white text-[10px] px-2 py-0.5 shadow">
                    Busy
                </div>
            ) : null}
        </button>
    );
}