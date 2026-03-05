import type { SearchRequest, SearchResponse } from "../../types/api";

export async function searchTables(payload: SearchRequest): Promise<SearchResponse> {
    const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        throw new Error(`Search failed: ${res.status}`);
    }

    return res.json();
}