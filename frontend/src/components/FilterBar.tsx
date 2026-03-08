type Props = {
    start: string;
    partySize: number;
    zone: string;
    minStart: string;
    maxStart: string;
    onChange: (patch: Partial<{ start: string; partySize: number; zone: string }>) => void;
    onSearch: () => void;
};

const MAX_PARTY_SIZE = 12;

export default function FilterBar({
                                      start,
                                      partySize,
                                      zone,
                                      minStart,
                                      maxStart,
                                      onChange,
                                      onSearch,
                                  }: Props) {
    const partySizeTooLarge = partySize > MAX_PARTY_SIZE;
    const partySizeTooSmall = partySize < 1 || Number.isNaN(partySize);
    const invalidPartySize = partySizeTooLarge || partySizeTooSmall;

    return (
        <div className="flex flex-wrap items-end gap-3 rounded-xl bg-slate-50 p-4">
            <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-600">Date & Time</label>
                <input
                    type="datetime-local"
                    value={start}
                    step={1800}
                    min={minStart}
                    max={maxStart}
                    onChange={(e) => onChange({start: e.target.value})}
                    className="rounded-lg border px-3 py-2"
                />
            </div>

            <div className="relative flex flex-col">
                <label className="text-xs font-medium text-gray-600">Party size</label>
                <input
                    type="number"
                    min={1}
                    max={12}
                    value={partySize}
                    onChange={(e) => onChange({partySize: Number(e.target.value)})}
                    className={`w-32 rounded-lg border px-3 py-2 ${
                        invalidPartySize ? "border-red-400 bg-red-50" : ""
                    }`}
                />
                {partySizeTooLarge && (
                    <span className="absolute top-full mt-1 text-xs text-amber-700 whitespace-nowrap">
            Online booking supports up to 12 guests.
        </span>
                )}
            </div>

            <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-600">Zone</label>
                <select
                    value={zone}
                    onChange={(e) => onChange({zone: e.target.value})}
                    className="w-44 rounded-lg border px-3 py-2"
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
                disabled={invalidPartySize}
                className="rounded-lg bg-gray-900 px-5 py-2 text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
                Search
            </button>
        </div>
    );
}