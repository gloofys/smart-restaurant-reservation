import {useEffect, useMemo, useState} from "react";
import FloorPlan from "./components/floorPlan/FloorPlan";
import FilterBar from "./components/FilterBar";
import PreferenceFilters from "./components/PreferenceFilters";
import {searchTables} from "./components/api/api";
import type {Table} from "./types/table";
import BookingConfirmationPage from "././components/pages/BookingConfirmationPage";

type Step = "search" | "confirm";

export default function App() {
    const [tables, setTables] = useState<Table[]>([]);
    const [occupied, setOccupied] = useState<number[]>([]);
    const [recommended, setRecommended] = useState<number[]>([]);

    const [start, setStart] = useState("2026-03-05T19:00");
    const [partySize, setPartySize] = useState(3);
    const [zone, setZone] = useState("ANY");
    const [preferences, setPreferences] = useState<string[]>([]);

    const [appliedStart, setAppliedStart] = useState("2026-03-05T19:00");
    const [appliedPartySize, setAppliedPartySize] = useState(3);
    const [appliedZone, setAppliedZone] = useState("ANY");

    const [selectedTableIds, setSelectedTableIds] = useState<number[]>([]);
    const [step, setStep] = useState<Step>("search");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const requiresMergedTables = appliedPartySize >= 9;

    async function handleSearch() {
        setLoading(true);
        setError(null);
        setSelectedTableIds([]);
        setStep("search");

        try {
            const payload: any = {
                start: normalizeDatetimeLocal(start),
                partySize,
            };

            if (zone !== "ANY") payload.zone = zone;
            if (preferences.length > 0) payload.preferences = preferences;

            const res = await searchTables(payload);

            setTables(res.availableTables);
            setOccupied(res.occupiedTableIDs);
            setRecommended(res.recommendedTableIDs);

            // only update applied state after a successful search
            setAppliedStart(start);
            setAppliedPartySize(partySize);
            setAppliedZone(zone);
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

    const selectedTables = visibleTables.filter((t) => selectedTableIds.includes(t.id));
    const selectedCapacity = selectedTables.reduce((sum, t) => sum + t.capacity, 0);

    const canContinue = requiresMergedTables
        ? selectedTableIds.length === 2
        : selectedTableIds.length === 1;

    function handleSelectTable(table: Table) {
        if (occupied.includes(table.id)) return;

        if (!requiresMergedTables) {
            setSelectedTableIds([table.id]);
            return;
        }

        // for large groups, only recommended pair is selectable
        const isAllowed = recommended.includes(table.id);
        if (!isAllowed) return;

        const isAlreadySelected = selectedTableIds.includes(table.id);

        if (isAlreadySelected) {
            setSelectedTableIds((prev) => prev.filter((id) => id !== table.id));
            return;
        }

        if (selectedTableIds.length === 2) return;

        setSelectedTableIds((prev) => [...prev, table.id]);
    }

    return (
        <div className="p-6 space-y-4">
            {step === "search" && (
                <>
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

                    <PreferenceFilters
                        preferences={preferences}
                        onChange={setPreferences}
                    />

                    {error && <div className="text-sm text-red-600">{error}</div>}
                    {loading && <div className="text-sm text-gray-600">Loading...</div>}

                    <FloorPlan
                        tables={visibleTables}
                        occupied={occupied}
                        recommended={recommended}
                        selectedTableIds={selectedTableIds}
                        partySize={appliedPartySize}
                        onSelectTable={handleSelectTable}
                    />

                    {selectedTables.length > 0 && (
                        <div className="rounded-xl border bg-white p-4 shadow-sm space-y-3">
                            <div>
                                <div className="text-sm text-gray-500">
                                    {requiresMergedTables ? "Selected tables" : "Selected table"}
                                </div>

                                <div className="font-semibold text-gray-900">
                                    {selectedTables.map((t) => `Table ${t.id}`).join(" + ")}
                                </div>
                            </div>

                            <div className="text-sm text-gray-600">
                                Total capacity: {selectedCapacity}
                            </div>

                            {requiresMergedTables && (
                                <div className="text-sm text-gray-600">
                                    For parties of 9+, please choose both highlighted tables.
                                </div>
                            )}

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedTableIds([])}
                                    className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    disabled={!canContinue}
                                    onClick={() => setStep("confirm")}
                                    className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {step === "confirm" && selectedTables.length > 0 && (
                <BookingConfirmationPage
                    start={appliedStart}
                    partySize={appliedPartySize}
                    zone={appliedZone}
                    selectedTables={selectedTables}
                    onBack={() => setStep("search")}
                    onConfirm={() => {
                        console.log("Booking confirmed");
                    }}
                />
            )}
        </div>
    );
}

function normalizeDatetimeLocal(v: string) {
    return v.length === 16 ? `${v}:00` : v;
}