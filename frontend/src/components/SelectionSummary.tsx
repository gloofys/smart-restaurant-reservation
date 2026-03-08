import type {Table} from "../types/table";

type Props = {
    selectedTables: Table[];
    selectedCapacity: number;
    requiresMergedTables: boolean;
    canContinue: boolean;
    onCancel: () => void;
    onContinue: () => void;
};

export default function SelectionSummary({
                                             selectedTables,
                                             selectedCapacity,
                                             requiresMergedTables,
                                             canContinue,
                                             onCancel,
                                             onContinue,
                                         }: Props) {
    const hasSelection = selectedTables.length > 0;

    return (
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="space-y-2">

                    {hasSelection ? (
                        <>
                            <div className="text-xl font-semibold text-slate-900">
                                {selectedTables.map((t) => `Table ${t.id}`).join(" + ")}
                            </div>

                            <div className="text-sm text-slate-600">
                                Total capacity: {selectedCapacity}
                            </div>

                            {requiresMergedTables && (
                                <div className="text-sm text-slate-600">
                                    Your booking requires two combined tables. Please select both highlighted tables to
                                    continue.
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="text-xl font-semibold text-slate-900">
                                {requiresMergedTables ? "Please choose two tables" : "Please choose a table"}
                            </div>

                            <div className="mt-1 text-sm text-slate-600">
                                {requiresMergedTables
                                    ? "Select both highlighted tables to continue."
                                    : "Select one suitable table to continue."}
                            </div>
                        </>
                    )}
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={!hasSelection}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        disabled={!canContinue}
                        onClick={onContinue}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}