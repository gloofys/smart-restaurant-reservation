import { useEffect, useState } from "react";
import FloorPlan from "./components/floorPlan/FloorPlan";
import FilterBar from "./components/FilterBar";
import { searchTables } from "./components/api/api";
import type { Table } from "./types/table";

export default function App() {
    const [tables, setTables] = useState<Table[]>([]);
    const [occupied, setOccupied] = useState<number[]>([]);
    const [recommended, setRecommended] = useState<number[]>([]);

    const [start, setStart] = useState("2026-03-05T19:00");
    const [partySize, setPartySize] = useState(3);
    const [zone, setZone] = useState("ANY");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSearch() {
        setLoading(true);
        setError(null);
        try {
            const payload: any = {
                start: normalizeDatetimeLocal(start),
                partySize,
            };
            if (zone !== "ANY") payload.zone = zone;

            const res = await searchTables(payload);

            setTables(res.availableTables);
            setOccupied(res.occupiedTableIDs);
            setRecommended(res.recommendedTableIDs);
        } catch (e: any) {
            setError(e.message ?? "Search failed");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="p-6 space-y-4">
            <FilterBar
                start={start}
                partySize={partySize}
                zone={zone}
                onChange={(patch) => {
                    if (patch.start !== undefined) setStart(patch.start);
                    if (patch.partySize !== undefined) setPartySize(patch.partySize);
                    if (patch.zone !== undefined) setZone(patch.zone);
                }}
                onSearch={handleSearch}
            />

            {error && <div className="text-sm text-red-600">{error}</div>}
            {loading && <div className="text-sm text-gray-600">Loading...</div>}

            <FloorPlan tables={tables} occupied={occupied} recommended={recommended} />
        </div>
    );
}

// ensures "YYYY-MM-DDTHH:mm" -> "YYYY-MM-DDTHH:mm:00"
function normalizeDatetimeLocal(v: string) {
    return v.length === 16 ? `${v}:00` : v;
}