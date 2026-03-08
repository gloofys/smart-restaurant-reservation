type Props = {
    preferences: string[];
    onChange: (next: string[]) => void;
    disabled?: boolean;
};

const OPTIONS = [
    { value: "WINDOW", label: "Window" },
    { value: "QUIET", label: "Quiet" },
    { value: "NEAR_PLAY_AREA", label: "Near play area" },
];

export default function PreferenceFilters({
                                              preferences,
                                              onChange,
                                              disabled = false,
                                          }: Props) {
    return (
        <div className="space-y-2">
            <div className="text-xs font-medium text-gray-600">Preferences</div>

            <div className="flex flex-wrap gap-2">
                {OPTIONS.map(({ value, label }) => {
                    const isSelected = preferences.includes(value);

                    return (
                        <button
                            key={value}
                            type="button"
                            disabled={disabled}
                            onClick={() => {
                                if (disabled) return;

                                if (isSelected) {
                                    onChange(preferences.filter((p) => p !== value));
                                } else {
                                    onChange([...preferences, value]);
                                }
                            }}
                            className={`rounded-full border px-4 py-2 text-sm transition ${
                                disabled
                                    ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 opacity-70"
                                    : isSelected
                                        ? "border-slate-900 bg-slate-900 text-white"
                                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                            }`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}