import {formatDateTime} from "../helpers/formatDateTime.ts";

type Props = {
    start: string;
    partySize: number;
    tableLabel: string;
    mealName?: string;
    mealQuantity?: number;
    extrasTotal?: number;
    onNewBooking: () => void;
};

export default function BookingSuccessPage({
                                               start,
                                               partySize,
                                               tableLabel,
                                               mealName,
                                               mealQuantity,
                                               extrasTotal,
                                               onNewBooking,
                                           }: Props) {
    return (
        <div className="mx-auto max-w-4xl">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="p-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
                        ✓
                    </div>

                    <h2 className="text-2xl font-semibold text-slate-900">
                        Booking confirmed
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Your reservation has been successfully confirmed.
                    </p>
                </div>

                <div className="grid gap-0 border-t border-slate-100 md:grid-cols-2">
                    <div className="bg-slate-50/70 p-6">
                        <h3 className="mb-4 text-lg font-semibold text-slate-900">
                            Reservation details
                        </h3>

                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">Date & time</span>
                                <span className="font-medium text-slate-900">{formatDateTime(start)}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">Party size</span>
                                <span className="font-medium text-slate-900">{partySize}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">Table(s)</span>
                                <span className="font-medium text-slate-900">{tableLabel}</span>
                            </div>

                            {mealName && mealQuantity && (
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">Chef&apos;s offer</span>
                                    <span className="font-medium text-slate-900">
                                        {mealQuantity} × {mealName}
                                    </span>
                                </div>
                            )}

                            {extrasTotal !== undefined && extrasTotal > 0 && (
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">Extras total</span>
                                    <span className="font-medium text-slate-900">
                                        €{extrasTotal.toFixed(2)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-6">
                        <h3 className="mb-4 text-lg font-semibold text-slate-900">
                            Restaurant location
                        </h3>

                        <div className="space-y-3">
                            <div className="text-sm text-slate-700">
                                <div className="font-medium text-slate-900">CGI Restaurant</div>
                                <div>A.H. Tammsaare tee 56</div>
                                <div>Tallinn, Estonia</div>
                            </div>

                            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                                <img
                                    src="/map.png"
                                    alt="Restaurant location map"
                                    className="h-56 w-full object-cover"
                                />
                            </div>

                            <p className="text-sm text-slate-500">
                                Please arrive 5–10 minutes before your reservation time.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-100 p-6">
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={onNewBooking}
                            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
                        >
                            Make another booking
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}