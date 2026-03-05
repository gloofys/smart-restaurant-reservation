import { useEffect, useState } from "react";
import FloorPlan from "./components/floorPlan/FloorPlan";
import { searchTables } from "./components/api/api";
import type { Table } from "./types/table";
import type { SearchResponse } from "./types/api";

export default function App() {
    const [tables, setTables] = useState<Table[]>([]);
    const [occupied, setOccupied] = useState<number[]>([]);
    const [recommended, setRecommended] = useState<number[]>([]);
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);

    useEffect(() => {
        async function load() {
            const res: SearchResponse = await searchTables();

            setTables(res.availableTables);
            setOccupied(res.occupiedTableIDs);
            setRecommended(res.recommendedTableIDs);
        }

        load();
    }, []);

    return (
        <div className="p-6">
            <FloorPlan
                tables={tables}
                occupied={occupied}
                recommended={recommended}
                onSelectTable={setSelectedTable}
            />

            {selectedTable && (
                <div className="fixed bottom-6 right-6 bg-white border shadow-lg rounded-lg p-4 w-60">
                    <h3 className="font-semibold text-lg">
                        Table {selectedTable.id}
                    </h3>

                    <p className="text-sm text-gray-600">
                        {selectedTable.capacity} seats
                    </p>

                    <p className="text-sm text-gray-600">
                        Zone: {selectedTable.zone}
                    </p>

                    <button className="mt-3 w-full bg-gray-900 text-white py-2 rounded">
                        Reserve
                    </button>

                    <button
                        className="mt-2 w-full text-sm text-gray-500"
                        onClick={() => setSelectedTable(null)}
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
}