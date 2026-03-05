import type { Table } from "./table"

export type SearchRequest = {
    start: string;
    partySize: number;
    zone?: string;
};

export type SearchResponse = {
    availableTables: Table[];
    occupiedTableIDs: number[];
    recommendedTableIDs: number[];
};