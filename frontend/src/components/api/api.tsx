import type { SearchResponse } from "../../types/api";

export async function searchTables(): Promise<SearchResponse> {
    const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            start: "2026-03-05T19:00:00",
            partySize: 3,
        }),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`API ${res.status}: ${text}`);
    }

    return res.json();
}