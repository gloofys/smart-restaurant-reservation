import type { Table } from "../../types/table";

type Props = {
    table: Table;
    occupied: boolean;
    recommended: boolean;
    selected?: boolean;
    onSelect?: (id: number) => void;
};

function getDims(capacity: number) {
    // width/height by capacity (feel free to tweak)
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
                                      onSelect,
                                  }: Props) {
    const { w, h, shape } = getDims(table.capacity);

    const ring = selected
        ? "ring-2 ring-blue-500"
        : recommended
            ? "ring-2 ring-green-500"
            : occupied
                ? "ring-2 ring-red-500"
                : "ring-1 ring-gray-200";

    const bg = occupied ? "bg-gray-50" : "bg-white";
    const opacity = occupied ? "opacity-70" : "opacity-100";
    const cursor = occupied ? "cursor-not-allowed" : "cursor-pointer";

    const radius =
        shape === "round" ? "9999px" : shape === "square" ? "14px" : "16px";

    return (
        <button
            type="button"
            disabled={occupied}
            onClick={() => onSelect?.(table.id)}
            className={`absolute ${cursor} ${opacity} ${bg} border border-gray-200 shadow-sm hover:shadow-md transition-shadow ${ring}`}
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

            {recommended && (
                <div className="absolute -top-2 -right-2 rounded-full bg-green-600 text-white text-[10px] px-2 py-0.5 shadow">
                    Best
                </div>
            )}
            {occupied && (
                <div className="absolute -top-2 -right-2 rounded-full bg-red-600 text-white text-[10px] px-2 py-0.5 shadow">
                    Busy
                </div>
            )}
        </button>
    );
}