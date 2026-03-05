import { useEffect, useMemo, useState } from "react";
import FloorPlan from "./components/floorPlan/FloorPlan";
import FilterBar from "./components/FilterBar";
import PreferenceFilters from "./components/PreferenceFilters";
import { searchTables } from "./components/api/api";
import type { Table } from "./types/table";

export default function App() {
    // server data
    const [tables, setTables] = useState<Table[]>([]);
    const [occupied, setOccupied] = useState<number[]>([]);

    // hard filters (server)
    const [start, setStart] = useState("2026-03-05T19:00");
    const [partySize, setPartySize] = useState(3);
    const [zone, setZone] = useState("ANY");

    // soft filters (client)
    const [preferences, setPreferences] = useState<string[]>([]);

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
        } catch (e: any) {
            setError(e.message ?? "Search failed");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleSearch();
    }, []);


    const visibleTables = useMemo(() => {
        if (preferences.length === 0) return tables;

        return tables.filter((t: any) =>
            preferences.every((p) => (t.preferences ?? []).includes(p))
        );
    }, [tables, preferences]);

    const recommended = useMemo(() => {
        const isFreeAndFits = (t: Table) => !occupied.includes(t.id) && t.capacity >= partySize;

        let candidates = visibleTables.filter(isFreeAndFits);

        if (candidates.length === 0) {
            candidates = tables.filter(isFreeAndFits);
        }

        if (candidates.length === 0) return [];

        const score = (t: Table) => {
            let s = 0;

            s -= (t.capacity - partySize);

            for (const p of preferences) {
                if ((t.preferences ?? []).includes(p)) s += 5;
            }

            return s;
        };

        let best = candidates[0];
        for (const t of candidates) {
            if (score(t) > score(best)) best = t;
        }

        return [best.id];
    }, [visibleTables, tables, occupied, partySize, preferences]);

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

            <PreferenceFilters preferences={preferences} onChange={setPreferences} />

            {error && <div className="text-sm text-red-600">{error}</div>}
            {loading && <div className="text-sm text-gray-600">Loading...</div>}

            <FloorPlan tables={visibleTables} occupied={occupied} recommended={recommended} />
        </div>
    );
}

// ensures "YYYY-MM-DDTHH:mm" -> "YYYY-MM-DDTHH:mm:00"
function normalizeDatetimeLocal(v: string) {
    return v.length === 16 ? `${v}:00` : v;
}