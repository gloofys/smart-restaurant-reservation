import { useEffect, useMemo, useState } from "react";
import { getRandomMeal, type Meal } from "../api/mealApi";
import type { Table } from "../../types/table";

type Props = {
    start: string;
    partySize: number;
    selectedTables: Table[];
    onBack: () => void;
    onConfirm: (payload?: {
        mealName?: string;
        quantity?: number;
        extrasTotal: number;
    }) => void;
};

const CHEF_OFFER_PRICE = 19.99;

export default function BookingConfirmationPage({
                                                    start,
                                                    partySize,
                                                    selectedTables,
                                                    onBack,
                                                    onConfirm,
                                                }: Props) {
    const [meal, setMeal] = useState<Meal | null>(null);
    const [mealLoading, setMealLoading] = useState(false);
    const [mealError, setMealError] = useState<string | null>(null);

    const [quantity, setQuantity] = useState(1);
    const [addedOffer, setAddedOffer] = useState<{
        mealId: string;
        mealName: string;
        quantity: number;
        unitPrice: number;
    } | null>(null);

    const totalCapacity = selectedTables.reduce((sum, t) => sum + t.capacity, 0);

    useEffect(() => {
        let ignore = false;

        async function loadMeal() {
            setMealLoading(true);
            setMealError(null);

            try {
                const suggestedMeal = await getRandomMeal();

                if (!ignore) {
                    setMeal(suggestedMeal);
                    setQuantity(1);
                }
            } catch (e: any) {
                if (!ignore) {
                    setMealError(e.message ?? "Failed to load chef's offer");
                }
            } finally {
                if (!ignore) {
                    setMealLoading(false);
                }
            }
        }

        loadMeal();

        return () => {
            ignore = true;
        };
    }, []);

    const offerTotal = useMemo(() => {
        if (!addedOffer) return 0;
        return addedOffer.quantity * addedOffer.unitPrice;
    }, [addedOffer]);

    function handleDecrease() {
        setQuantity((prev) => Math.max(0, prev - 1));
    }

    function handleIncrease() {
        setQuantity((prev) => Math.min(partySize, prev + 1));
    }

    function handleAddToReservation() {
        if (!meal) return;

        if (quantity === 0) {
            setAddedOffer(null);
            return;
        }

        setAddedOffer({
            mealId: meal.idMeal,
            mealName: meal.strMeal,
            quantity,
            unitPrice: CHEF_OFFER_PRICE,
        });
    }

    const isAdded = addedOffer?.mealId === meal?.idMeal;

    return (
            <div className="rounded-xl border bg-white p-6 shadow-sm space-y-6">
                <div>
                    <h2 className="text-2xl font-semibold">Booking confirmation</h2>
                    <p className="text-sm text-gray-500">
                        Review your reservation details and optional chef&apos;s offer before confirming.
                    </p>
                </div>

                <section className="space-y-3">
                    <h3 className="text-lg font-semibold">Reservation details</h3>

                    <div className="grid gap-3 rounded-lg bg-gray-50 p-4 text-sm sm:grid-cols-2">
                        <div>
                            <span className="font-medium">Date & time:</span> {start}
                        </div>
                        <div>
                            <span className="font-medium">Party size:</span> {partySize}
                        </div>
                        <div>
                            <span className="font-medium">Table:</span> {selectedTables.map((t) => t.id).join(", ")}
                        </div>
                        <div>
                            <span className="font-medium">Total capacity:</span> {totalCapacity}
                        </div>
                    </div>
                </section>

                <section className="border-t pt-6 space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold">Chef&apos;s offer</h3>
                        <p className="text-sm text-gray-500">
                            Add a recommended dish to this reservation.
                        </p>
                    </div>

                    {mealLoading && (
                        <div className="text-sm text-gray-600">Loading chef&apos;s offer...</div>
                    )}

                    {mealError && (
                        <div className="text-sm text-red-600">{mealError}</div>
                    )}

                    {!mealLoading && !mealError && meal && (
                        <div className="grid gap-5 md:grid-cols-[220px_1fr]">
                            {meal.strMealThumb && (
                                <img
                                    src={meal.strMealThumb}
                                    alt={meal.strMeal}
                                    className="h-56 w-full rounded-lg border object-cover"
                                />
                            )}

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                                        Chef&apos;s Offer
                                    </div>

                                    <h4 className="text-xl font-semibold text-gray-900">
                                        {meal.strMeal}
                                    </h4>

                                    <div className="text-sm text-gray-600">
                                        {meal.strCategory && <span>{meal.strCategory}</span>}
                                        {meal.strCategory && meal.strArea && <span> • </span>}
                                        {meal.strArea && <span>{meal.strArea}</span>}
                                    </div>

                                    <div className="text-2xl font-bold text-gray-900">
                                        €19.99
                                    </div>

                                    <p className="text-sm text-gray-700">
                                        A special dish recommended by the chef for your table.
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="flex items-center rounded-lg border">
                                        <button
                                            type="button"
                                            onClick={handleDecrease}
                                            className="px-3 py-2 text-sm font-medium hover:bg-gray-50"
                                        >
                                            −
                                        </button>

                                        <div className="min-w-[48px] px-3 text-center text-sm font-medium">
                                            {quantity}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleIncrease}
                                            className="px-3 py-2 text-sm font-medium hover:bg-gray-50"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleAddToReservation}
                                        className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                                    >
                                        {isAdded ? "Update reservation" : "Add to reservation"}
                                    </button>
                                </div>

                                <div className="text-xs text-gray-500">
                                    You can add up to {partySize} dishes for this reservation.
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                <section className="border-t pt-6 space-y-3">
                    <h3 className="text-lg font-semibold">Summary</h3>

                    <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Reservation</span>
                            <span className="font-medium">Included</span>
                        </div>

                        {addedOffer ? (
                            <div className="flex items-start justify-between gap-4 border-t pt-3">
                                <div>
                                    <div className="font-medium text-gray-900">
                                        {addedOffer.mealName}
                                    </div>
                                    <div className="text-gray-500">
                                        {addedOffer.quantity} × €{addedOffer.unitPrice.toFixed(2)}
                                    </div>
                                </div>

                                <div className="font-medium text-gray-900">
                                    €{offerTotal.toFixed(2)}
                                </div>
                            </div>
                        ) : (
                            <div className="border-t pt-3 text-gray-500">
                                No chef&apos;s offer added.
                            </div>
                        )}

                        <div className="flex items-center justify-between border-t pt-3 text-base">
                            <span className="font-semibold text-gray-900">Total extras</span>
                            <span className="font-semibold text-gray-900">
                                €{offerTotal.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </section>

                <section className="border-t pt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                    <button
                        type="button"
                        onClick={onBack}
                        className="rounded-lg border px-4 py-3 text-sm font-medium hover:bg-gray-50"
                    >
                        Back
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            onConfirm({
                                mealName: addedOffer?.mealName,
                                quantity: addedOffer?.quantity,
                                extrasTotal: offerTotal,
                            })
                        }
                        className="rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white hover:opacity-90"
                    >
                        Confirm booking
                    </button>
                </section>
            </div>
    );
}