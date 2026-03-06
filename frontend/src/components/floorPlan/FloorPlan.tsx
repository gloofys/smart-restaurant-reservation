import TableNode from "./TableNode";
import Legend from "./Legend";
import Zones from "./Zones";
import type { Table } from "../../types/table";

type Props = {
    tables: Table[];
    occupied: number[];
    recommended: number[];
    selectedTableIds: number[];
    partySize: number;
    preferences: string[];
    onSelectTable: (table: Table) => void;
};

export default function FloorPlan({
                                      tables,
                                      occupied,
                                      recommended,
                                      selectedTableIds,
                                      partySize,
                                      preferences,
                                      onSelectTable,
                                  }: Props) {
    const requiresMergedTables = partySize >= 9;

    return (
        <div className="space-y-3">
            <div className="flex justify-center">
                <Legend />
            </div>

            <div className="overflow-x-auto">
                <div className="flex min-w-[900px] justify-center">
                    <div className="relative h-[600px] w-[900px] overflow-hidden rounded-xl border bg-white shadow-sm">
                        <div
                            className="absolute inset-0 opacity-40"
                            style={{
                                backgroundImage:
                                    "linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)",
                                backgroundSize: "20px 20px",
                            }}
                        />

                        <div className="absolute inset-0">
                            <Zones />

                            {tables.map((table) => {
                                const isOccupied = occupied.includes(table.id);
                                const isRecommended = recommended.includes(table.id);
                                const isSelected = selectedTableIds.includes(table.id);

                                const tooSmall =
                                    !requiresMergedTables && table.capacity < partySize;

                                const matchesPreferences =
                                    preferences.length === 0 ||
                                    preferences.every((p) =>
                                        (table.preferences ?? []).includes(p)
                                    );

                                const dimmedByPreferences = !matchesPreferences;

                                const dimmedBySelection = requiresMergedTables
                                    ? !isSelected && !isRecommended
                                    : selectedTableIds.length > 0 && !isSelected;

                                const dimmed =
                                    tooSmall ||
                                    dimmedByPreferences ||
                                    dimmedBySelection;

                                const disabled = isOccupied || dimmed;

                                return (
                                    <TableNode
                                        key={table.id}
                                        table={table}
                                        occupied={isOccupied}
                                        recommended={isRecommended}
                                        selected={isSelected}
                                        dimmed={dimmed}
                                        onSelect={() => {
                                            if (!disabled) {
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