type Props = {
    start: string;
    partySize: number;
    zone: string;
    onChange: (patch: Partial<{ start: string; partySize: number; zone: string }>) => void;
    onSearch: () => void;
};

export default function FilterBar({
                                      start,
                                      partySize,
                                      zone,
                                      onChange,
                                      onSearch,
                                  }: Props) {
    return (
        <div className="flex flex-wrap gap-3 items-end bg-slate-50 rounded-xl p-4">
            <div className="flex flex-col">
                <label className="text-xs text-gray-600 font-medium">Date & Time</label>
                <input
                    type="datetime-local"
                    value={start}
                    step={1800}
                    min="2026-01-01T10:00"
                    max="2026-12-31T22:00"
                    onChange={(e) => onChange({ start: e.target.value })}
                    className="border rounded-lg px-3 py-2"
                />
            </div>

            <div className="flex flex-col">
                <label className="text-xs text-gray-600 font-medium">Party size</label>
                <input
                    type="number"
                    min={1}
                    max={20}
                    value={partySize}
                    onChange={(e) => onChange({ partySize: Number(e.target.value) })}
                    className="border rounded-lg px-3 py-2 w-32"
                />
            </div>

            <div className="flex flex-col">
                <label className="text-xs text-gray-600 font-medium">Zone</label>
                <select
                    value={zone}
                    onChange={(e) => onChange({ zone: e.target.value })}
                    className="border rounded-lg px-3 py-2 w-44"
                >
                    <option value="ANY">All zones</option>
                    <option value="MAIN_HALL">Main Hall</option>
                    <option value="TERRACE">Terrace</option>
                    <option value="PRIVATE_ROOM">Private Room</option>
                </select>
            </div>

            <button
                type="button"
                onClick={onSearch}
                className="bg-gray-900 text-white px-5 py-2 rounded-lg hover:opacity-90"
            >
                Search
            </button>
        </div>
    );
}