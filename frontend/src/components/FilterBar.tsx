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
        <div className="flex flex-wrap gap-3 items-end bg-white border rounded-xl p-4 shadow-sm">
            <div className="flex flex-col">
                <label className="text-xs text-gray-600 font-medium">Kuupäev & kellaaeg</label>
                <input
                    type="datetime-local"
                    value={start}
                    onChange={(e) => onChange({ start: e.target.value })}
                    className="border rounded-lg px-3 py-2"
                />
            </div>

            <div className="flex flex-col">
                <label className="text-xs text-gray-600 font-medium">Inimeste arv</label>
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
                <label className="text-xs text-gray-600 font-medium">Tsoon</label>
                <select
                    value={zone}
                    onChange={(e) => onChange({ zone: e.target.value })}
                    className="border rounded-lg px-3 py-2 w-44"
                >
                    <option value="ANY">Kõik</option>
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