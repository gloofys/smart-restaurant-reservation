type Props = {
    preferences: string[];
    onChange: (next: string[]) => void;
};

const PREFS = [
    { key: "WINDOW", label: "Window" },
    { key: "QUIET", label: "Quiet" },
    { key: "NEAR_PLAY_AREA", label: "Near play area" },
] as const;

export default function PreferenceFilters({ preferences, onChange }: Props) {
    function toggle(pref: string) {
        const next = preferences.includes(pref)
            ? preferences.filter((p) => p !== pref)
            : [...preferences, pref];
        onChange(next);
    }

    return (
        <div className="bg-white border rounded-xl p-4 shadow-sm">
            <div className="text-xs text-gray-600 font-medium mb-2">Eelistused</div>

            <div className="flex flex-wrap gap-2">
                {PREFS.map((p) => {
                    const active = preferences.includes(p.key);
                    return (
                        <button
                            key={p.key}
                            type="button"
                            onClick={() => toggle(p.key)}
                            className={`px-3 py-1.5 rounded-full border text-sm transition ${
                                active
                                    ? "bg-gray-900 text-white border-gray-900"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                            {p.label}
                        </button>
                    );
                })}

                {preferences.length > 0 && (
                    <button
                        type="button"
                        onClick={() => onChange([])}
                        className="px-3 py-1.5 rounded-full border text-sm bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
                    >
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
}