import type { Table } from "./table"

export type SearchResponse = {
    availableTables: Table[]
    occupiedTableIDs: number[]
    recommendedTableIDs: number[]
}