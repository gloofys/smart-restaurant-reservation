import { useEffect, useState } from "react";
import FloorPlan from "./components/floorPlan/FloorPlan";
import FilterBar from "./components/FilterBar";
import PreferenceFilters from "./components/PreferenceFilters";
import { searchTables } from "./components/api/api";
import type { Table } from "./types/table";
import BookingConfirmationPage from "./components/pages/BookingConfirmationPage";
import SelectionSummary from "./components/SelectionSummary.tsx";

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

    const selectedTables = tables.filter((t) => selectedTableIds.includes(t.id));
    const selectedCapacity = selectedTables.reduce((sum, t) => sum + t.capacity, 0);

    const canContinue = requiresMergedTables
        ? selectedTableIds.length === 2
        : selectedTableIds.length === 1;

    const hasBaseSingleTable = tables.some((table) => {
        const matchesZone = appliedZone === "ANY" || table.zone === appliedZone;

        return (
            !occupied.includes(table.id) &&
            table.capacity >= appliedPartySize &&
            matchesZone
        );
    });

    const hasPreferenceMatchedSingleTable = tables.some((table) => {
        const matchesZone = appliedZone === "ANY" || table.zone === appliedZone;

        const matchesPreferences =
            preferences.length === 0 ||
            preferences.every((p) => (table.preferences ?? []).includes(p));

        return (
            !occupied.includes(table.id) &&
            table.capacity >= appliedPartySize &&
            matchesZone &&
            matchesPreferences
        );
    });

    const noTablesForSearch = requiresMergedTables
        ? recommended.length !== 2
        : !hasBaseSingleTable;

    const noTablesForPreferences =
        !requiresMergedTables &&
        hasBaseSingleTable &&
        !hasPreferenceMatchedSingleTable;

    function handleSelectTable(table: Table) {
        if (occupied.includes(table.id)) return;

        if (!requiresMergedTables) {
            setSelectedTableIds([table.id]);
            return;
        }

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
        <div className="min-h-screen bg-slate-50">
            <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <h1 className="text-xl font-semibold text-slate-900">
                        Smart Restaurant Booking
                    </h1>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-6 py-8">
                {step === "search" && (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="p-6">
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
                        </div>

                        <div className="px-6 pb-6">
                            <PreferenceFilters
                                preferences={preferences}
                                onChange={(next) => {
                                    setPreferences(next);
                                    setSelectedTableIds([]);
                                }}
                            />
                        </div>

                        {(error || loading || noTablesForSearch || noTablesForPreferences) && (
                            <div className="border-t border-slate-100 px-6 py-4 space-y-3">
                                {error && (
                                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                        {error}
                                    </div>
                                )}

                                {loading && (
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                                        Loading...
                                    </div>
                                )}

                                {noTablesForSearch && !loading && !error && (
                                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                        No tables available for a party of {appliedPartySize} at this time.
                                        Please choose another date or time.
                                    </div>
                                )}

                                {noTablesForPreferences && !loading && !error && (
                                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                                        No tables match the selected preferences. Try removing some filters.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="border-t border-slate-100 p-6 space-y-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        Floor plan
                                    </h2>
                                    <p className="text-sm text-slate-500">
                                        Choose the most suitable table for your reservation.
                                    </p>
                                </div>

                            </div>

                            <FloorPlan
                                tables={tables}
                                preferences={preferences}
                                occupied={occupied}
                                recommended={recommended}
                                selectedTableIds={selectedTableIds}
                                partySize={appliedPartySize}
                                zone={appliedZone}
                                onSelectTable={handleSelectTable}
                            />
                        </div>
                        <SelectionSummary
                            selectedTables={selectedTables}
                            selectedCapacity={selectedCapacity}
                            requiresMergedTables={requiresMergedTables}
                            canContinue={canContinue}
                            onCancel={() => setSelectedTableIds([])}
                            onContinue={() => setStep("confirm")}
                        />
                    </div>
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
            </main>
        </div>
    );
}

function normalizeDatetimeLocal(v: string) {
    return v.length === 16 ? `${v}:00` : v;
}