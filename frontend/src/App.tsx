import {useEffect, useMemo, useState} from "react";
import FloorPlan from "./components/floorPlan/FloorPlan";
import FilterBar from "./components/FilterBar";
import PreferenceFilters from "./components/PreferenceFilters";
import {searchTables} from "./components/api/api";
import type {Table} from "./types/table";
import BookingConfirmationPage from "./components/pages/BookingConfirmationPage";
import SelectionSummary from "./components/SelectionSummary";
import BookingSuccessPage from "./components/pages/BookingSuccessPage";
import Legend from "./components/floorPlan/Legend.tsx";

type Step = "search" | "confirm" | "success";

type SearchPayload = {
    start: string;
    partySize: number;
    zone?: string;
    preferences?: string[];
};

type ConfirmedExtras = {
    mealName?: string;
    quantity?: number;
    extrasTotal: number;
};

type AppliedFilters = {
    start: string;
    partySize: number;
    zone: string;
    preferences: string[];
};

const INITIAL_START = "2026-03-05T19:00";
const INITIAL_PARTY_SIZE = 3;
const INITIAL_ZONE = "ANY";
const MAX_ONLINE_PARTY_SIZE = 12;

export default function App() {
    const [tables, setTables] = useState<Table[]>([]);
    const [occupied, setOccupied] = useState<number[]>([]);
    const [recommended, setRecommended] = useState<number[]>([]);

    const [start, setStart] = useState(INITIAL_START);
    const [partySize, setPartySize] = useState(INITIAL_PARTY_SIZE);
    const [zone, setZone] = useState(INITIAL_ZONE);
    const [preferences, setPreferences] = useState<string[]>([]);

    const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
        start: INITIAL_START,
        partySize: INITIAL_PARTY_SIZE,
        zone: INITIAL_ZONE,
        preferences: [],
    });

    const [selectedTableIds, setSelectedTableIds] = useState<number[]>([]);
    const [step, setStep] = useState<Step>("search");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [confirmedExtras, setConfirmedExtras] = useState<ConfirmedExtras | null>(null);

    const occupiedSet = useMemo(() => new Set(occupied), [occupied]);

    const requiresMergedTables = recommended.length === 2;
    const partySizeTooLarge = partySize > MAX_ONLINE_PARTY_SIZE;

    useEffect(() => {
        void handleSearch();
    }, []);

// Note: this search and reservation state flow was refined with AI-assisted suggestions,
// then adapted manually to fit this project's reservation flow and UI behavior.

    async function handleSearch(overrides?: { preferences?: string[] }) {
        if (partySizeTooLarge) {
            clearSearchResults();
            setError(null);
            setStep("search");
            return;
        }

        const nextPreferences = overrides?.preferences ?? preferences;

        setLoading(true);
        setError(null);
        setSelectedTableIds([]);
        setStep("search");

        try {
            const payload = buildSearchPayload(start, partySize, zone, nextPreferences);
            const res = await searchTables(payload);

            setTables(res.availableTables);
            setOccupied(res.occupiedTableIDs);
            setRecommended(res.recommendedTableIDs);

            setAppliedFilters({
                start,
                partySize,
                zone,
                preferences: nextPreferences,
            });
        } catch (e: unknown) {
            setError(getErrorMessage(e));
        } finally {
            setLoading(false);
        }
    }

    function clearSearchResults() {
        setTables([]);
        setOccupied([]);
        setRecommended([]);
        setSelectedTableIds([]);
    }

    function handleSelectTable(table: Table) {
        if (occupiedSet.has(table.id)) return;

        if (requiresMergedTables) {
            handleMergedTableSelection(table.id);
            return;
        }

        setSelectedTableIds([table.id]);
    }

    function handleMergedTableSelection(tableId: number) {
        const isAllowed = recommended.includes(tableId);
        if (!isAllowed) return;

        const isAlreadySelected = selectedTableIds.includes(tableId);

        if (isAlreadySelected) {
            setSelectedTableIds((prev) => prev.filter((id) => id !== tableId));
            return;
        }

        if (selectedTableIds.length === 2) return;

        setSelectedTableIds((prev) => [...prev, tableId]);
    }

    const selectedTables = tables.filter((table) => selectedTableIds.includes(table.id));
    const selectedCapacity = selectedTables.reduce((sum, table) => sum + table.capacity, 0);

    const canContinue = requiresMergedTables
        ? selectedTableIds.length === 2
        : selectedTableIds.length === 1;

    const hasBaseSingleTable = tables.some((table) => {
        const matchesZone =
            appliedFilters.zone === INITIAL_ZONE || table.zone === appliedFilters.zone;

        return (
            !occupiedSet.has(table.id) &&
            table.capacity >= appliedFilters.partySize &&
            matchesZone
        );
    });

    const hasPreferenceMatchedSingleTable = tables.some((table) => {
        const matchesZone =
            appliedFilters.zone === INITIAL_ZONE || table.zone === appliedFilters.zone;

        return (
            !occupiedSet.has(table.id) &&
            table.capacity >= appliedFilters.partySize &&
            matchesZone &&
            tableMatchesPreferences(table, preferences)
        );
    });

    const noTablesForSearch = requiresMergedTables
        ? recommended.length !== 2
        : !hasBaseSingleTable;

    const noTablesForPreferences =
        !requiresMergedTables &&
        hasBaseSingleTable &&
        !hasPreferenceMatchedSingleTable;

    return (
        <div className="min-h-screen bg-slate-100">
            <header className="sticky top-0 z-10 border border-slate-200 bg-white/90 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <h1 className="text-xl font-semibold text-slate-900">
                        Smart Restaurant Booking
                    </h1>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-6 py-8">
                {step === "search" && (
                    <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-md">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/60">
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

                        <div className="space-y-3 px-6 pb-6 bg-white">
                            <PreferenceFilters
                                preferences={preferences}
                                disabled={requiresMergedTables}
                                onChange={(next) => {
                                    if (requiresMergedTables) return;
                                    setPreferences(next);
                                    setSelectedTableIds([]);
                                    void handleSearch({ preferences: next });
                                }}
                            />

                            {requiresMergedTables && !loading && !error && (
                                <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-700">
                                    For this reservation, two combined tables are required, so seating preferences are
                                    currently unavailable.
                                </div>
                            )}
                        </div>

                        {(error || loading || noTablesForSearch || noTablesForPreferences || partySizeTooLarge) && (
                            <div className="space-y-3 border-t border-slate-100 px-6 py-4">
                                {error && (
                                    <div
                                        className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                        {error}
                                    </div>
                                )}

                                {loading && (
                                    <div
                                        className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                                        Loading...
                                    </div>
                                )}

                                {partySizeTooLarge && !loading && !error && (
                                    <div
                                        className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                                        Online bookings are limited to 12 guests. For larger groups please contact
                                        us by phone or create two separate reservations.
                                    </div>
                                )}

                                {noTablesForSearch && !partySizeTooLarge && !loading && !error && (
                                    <div
                                        className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                        No tables available for a party of {appliedFilters.partySize} at this time.
                                        Please choose another date or time.
                                    </div>
                                )}

                                {noTablesForPreferences && !partySizeTooLarge && !loading && !error && (
                                    <div
                                        className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                                        No tables match the selected preferences. Try removing some filters.
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="space-y-4 border-t border-slate-100 p-6">
                            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-slate-900">
                                        Floor plan
                                    </h2>
                                    <p className="text-sm text-slate-500">
                                        Choose the most suitable table for your reservation.
                                    </p>
                                </div>

                                <div className="md:shrink-0">
                                    <Legend />
                                </div>
                            </div>

                            <FloorPlan
                                tables={tables}
                                preferences={preferences}
                                occupied={occupied}
                                recommended={recommended}
                                selectedTableIds={selectedTableIds}
                                partySize={appliedFilters.partySize}
                                zone={appliedFilters.zone}
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
                        start={appliedFilters.start}
                        partySize={appliedFilters.partySize}
                        selectedTables={selectedTables}
                        onBack={() => setStep("search")}
                        onConfirm={(payload) => {
                            setConfirmedExtras(payload ?? {extrasTotal: 0});
                            setStep("success");
                        }}
                    />
                )}

                {step === "success" && selectedTables.length > 0 && (
                    <BookingSuccessPage
                        start={appliedFilters.start}
                        partySize={appliedFilters.partySize}
                        tableLabel={selectedTables.map((table) => `Table ${table.id}`).join(" + ")}
                        mealName={confirmedExtras?.mealName}
                        mealQuantity={confirmedExtras?.quantity}
                        extrasTotal={confirmedExtras?.extrasTotal}
                        onNewBooking={() => {
                            setSelectedTableIds([]);
                            setConfirmedExtras(null);
                            setStep("search");
                        }}
                    />
                )}
            </main>
        </div>
    );
}

function buildSearchPayload(
    start: string,
    partySize: number,
    zone: string,
    preferences: string[]
): SearchPayload {
    const payload: SearchPayload = {
        start: normalizeDatetimeLocal(start),
        partySize,
    };

    if (zone !== INITIAL_ZONE) {
        payload.zone = zone;
    }

    if (preferences.length > 0) {
        payload.preferences = preferences;
    }

    return payload;
}

function tableMatchesPreferences(table: Table, preferences: string[]) {
    return (
        preferences.length === 0 ||
        preferences.every((preference) => (table.preferences ?? []).includes(preference))
    );
}

function normalizeDatetimeLocal(value: string) {
    return value.length === 16 ? `${value}:00` : value;
}

function getErrorMessage(error: unknown) {
    if (error instanceof Error) {
        return error.message;
    }

    return "Search failed";
}