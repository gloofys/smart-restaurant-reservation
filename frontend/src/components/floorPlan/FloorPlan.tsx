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
    onSelectTable: (table: Table) => void;
};

export default function FloorPlan({
                                      tables,
                                      occupied,
                                      recommended,
                                      selectedTableIds,
                                      partySize,
                                      onSelectTable,
                                  }: Props) {
    const requiresMergedTables = partySize >= 9;

    return (
        <div>
            <Legend />

            <div className="relative w-[900px] h-[600px] rounded-xl border bg-white shadow-sm overflow-hidden">
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

                        const dimmed = requiresMergedTables
                            ? !isSelected && !isRecommended
                            : selectedTableIds.length > 0 && !isSelected;

                        return (
                            <TableNode
                                key={table.id}
                                table={table}
                                occupied={isOccupied}
                                recommended={isRecommended}
                                selected={isSelected}
                                dimmed={dimmed}
                                onSelect={() => onSelectTable(table)}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}