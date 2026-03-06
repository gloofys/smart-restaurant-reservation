export type Meal = {
    idMeal: string;
    strMeal: string;
    strCategory: string | null;
    strArea: string | null;
    strInstructions: string | null;
    strMealThumb: string | null;
};

type MealDbResponse = {
    meals: Meal[] | null;
};

export async function getRandomMeal(): Promise<Meal | null> {
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");

    if (!res.ok) {
        throw new Error("Failed to fetch suggested meal");
    }

    const data: MealDbResponse = await res.json();
    return data.meals?.[0] ?? null;
}