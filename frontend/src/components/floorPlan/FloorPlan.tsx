import TableNode from "./TableNode";
import Zones from "./Zones";
import type {Table} from "../../types/table";

type Props = {
    tables: Table[];
    occupied: number[];
    recommended: number[];
    selectedTableIds: number[];
    partySize: number;
    preferences: string[];
    zone: string;
    onSelectTable: (table: Table) => void;
};

export default function FloorPlan({
                                      tables,
                                      occupied,
                                      recommended,
                                      selectedTableIds,
                                      partySize,
                                      preferences,
                                      zone,
                                      onSelectTable,
                                  }: Props) {

// Note: this search and selection state flow was refined with AI-assisted suggestions,
// then adapted manually to fit this project's reservation flow and UI behavior.

    function getTableState(table: Table) {
        const isOccupied = occupied.includes(table.id);
        const isSelected = selectedTableIds.includes(table.id);
        const isRecommended = recommended.includes(table.id);

        const requiresMergedTables = recommended.length === 2;

        const tooSmall = !requiresMergedTables && table.capacity < partySize;

        const matchesPreferences =
            preferences.length === 0 ||
            preferences.every((p) => (table.preferences ?? []).includes(p));

        const matchesZone = zone === "ANY" || table.zone === zone;

        if (isOccupied) {
            return {
                occupied: true,
                recommended: isRecommended,
                selected: false,
                dimmed: true,
                disabled: true,
            };
        }

        if (isRecommended) {
            return {
                occupied: false,
                recommended: true,
                selected: isSelected,
                dimmed: false,
                disabled: false,
            };
        }

        if (requiresMergedTables) {
            return {
                occupied: false,
                recommended: false,
                selected: false,
                dimmed: true,
                disabled: true,
            };
        }

        if (tooSmall || !matchesPreferences || !matchesZone) {
            return {
                occupied: false,
                recommended: false,
                selected: isSelected,
                dimmed: true,
                disabled: true,
            };
        }

        return {
            occupied: false,
            recommended: false,
            selected: isSelected,
            dimmed: false,
            disabled: false,
        };
    }

    return (
        <div className="space-y-3">
            <div className="overflow-x-auto">
                <div className="flex min-w-[900px] justify-center">
                    <div
                        className="relative h-[600px] w-[900px] overflow-hidden rounded-xl border bg-slate-50 shadow-sm">
                        <div
                            className="absolute inset-0 opacity-40"
                            style={{
                                backgroundImage:
                                    "linear-gradient(to right, rgba(148,163,184,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)",
                                backgroundSize: "24px 24px",
                            }}
                        />

                        <div className="absolute inset-0">
                            <Zones/>

                            {tables.map((table) => {
                                const state = getTableState(table);

                                return (
                                    <TableNode
                                        key={table.id}
                                        table={table}
                                        occupied={state.occupied}
                                        recommended={state.recommended}
                                        selected={state.selected}
                                        dimmed={state.dimmed}
                                        onSelect={() => {
                                            if (!state.disabled) {
                                                onSelectTable(table);
                                            }
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}