package com.example.cgi.core.service;

import com.example.cgi.api.dto.SearchRequest;
import com.example.cgi.api.dto.SearchResponse;
import com.example.cgi.api.dto.TableDto;
import com.example.cgi.core.domain.Booking;
import com.example.cgi.core.domain.Preference;
import com.example.cgi.core.domain.Table;
import com.example.cgi.persistence.repository.BookingRepository;
import com.example.cgi.persistence.repository.TableRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ReservationSearchService {

    private static final int DEFAULT_DURATION_MINUTES = 150;

    private final TableRepository tableRepository;
    private final BookingRepository bookingRepository;
    private final RecommendationService recommendationService;

    public ReservationSearchService(
            TableRepository tableRepository,
            BookingRepository bookingRepository,
            RecommendationService recommendationService
    ) {
        this.tableRepository = tableRepository;
        this.bookingRepository = bookingRepository;
        this.recommendationService = recommendationService;
    }
// Note: this service structure was refined with AI-assisted refactoring suggestions,
//but the final implementation and project-specific logic were adapted manually.

    public SearchResponse search(SearchRequest request) {
        LocalDateTime start = request.start;
        int duration = request.durationMinutes == null ? DEFAULT_DURATION_MINUTES : request.durationMinutes;
        LocalDateTime end = start.plusMinutes(duration);

        Set<Preference> preferences = request.preferences == null ? Set.of() : request.preferences;

        List<Table> tables = tableRepository.findAll();
        List<Booking> bookings = bookingRepository.findAll();

        List<Table> visibleTables = tables.stream()
                .filter(t -> request.zone == null || t.getZone() == request.zone)
                .toList();

        Set<Long> visibleTableIds = visibleTables.stream()
                .map(Table::getId)
                .collect(Collectors.toSet());

        Set<Long> occupiedTableIds = bookings.stream()
                .filter(b -> visibleTableIds.contains(b.getTableId()))
                .filter(b -> b.overlaps(start, end))
                .map(Booking::getTableId)
                .collect(Collectors.toSet());

        List<Long> recommendedTableIds = recommendationService.recommendTables(
                tables,
                bookings,
                request.partySize,
                start,
                end,
                preferences,
                request.zone
        );

        SearchResponse response = new SearchResponse();
        response.availableTables = visibleTables.stream()
                .map(this::toDto)
                .toList();
        response.occupiedTableIDs = occupiedTableIds;
        response.recommendedTableIDs = recommendedTableIds;
        return response;
    }

    private TableDto toDto(Table table) {
        TableDto dto = new TableDto();
        dto.id = table.getId();
        dto.capacity = table.getCapacity();
        dto.zone = table.getZone();
        dto.preferences = table.getPreferences();
        dto.x = table.getX();
        dto.y = table.getY();
        return dto;
    }
}