package com.example.cgi.api.dto;

import java.util.List;
import java.util.Set;

public class SearchResponse {
    public List<TableDto> availableTables;
    public Set<Long> occupiedTableIDs;
    public List<Long> recommendedTableIDs;
}
