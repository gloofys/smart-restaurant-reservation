package com.example.cgi.api.controller;

import com.example.cgi.api.dto.*;
import com.example.cgi.core.domain.Table;
import com.example.cgi.core.domain.Booking;
import com.example.cgi.core.domain.Preference;
import com.example.cgi.core.service.RecommendationService;
import com.example.cgi.persistence.repository.TableRepository;
import com.example.cgi.persistence.repository.BookingRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class ReservationController {

    private final TableRepository tableRepository;
    private final BookingRepository bookingRepository;
    private final RecommendationService recommendationService;

    public ReservationController(TableRepository tableRepository,
                                 BookingRepository bookingRepository,
                                 RecommendationService recommendationService) {
        this.tableRepository = tableRepository;
        this.bookingRepository = bookingRepository;
        this.recommendationService = recommendationService;
    }
    @PostMapping("/search")
    public SearchResponse search(@RequestBody SearchRequest request) {
        LocalDateTime start = request.start;
        int duration = (request.durationMinutes == null) ? 150 : request.durationMinutes;
        LocalDateTime end = start.plusMinutes(duration);

        Set<Preference> preferences = (request.preferences == null) ? Set.of() : request.preferences;

        List<Table> tables = tableRepository.findAll();
        if (request.zone != null) {
            tables = tables.stream()
                    .filter(t -> t.getZone() == request.zone)
                    .toList();
        }

        List<Booking> bookings = bookingRepository.findAll();

        Set<Long> occupied = bookings.stream()
                .filter(b -> b.overlaps(start, end))
                .map(Booking::getTableId)
                .collect(Collectors.toSet());

        Set<Long> visibleTableIds = tables.stream()
                .map(Table::getId)
                .collect(Collectors.toSet());

        occupied.retainAll(visibleTableIds);

        Table best = recommendationService.recommendTable(
                request.partySize,
                start,
                end,
                preferences,
                request.zone
        );

        SearchResponse response = new SearchResponse();
        response.availableTables = tables.stream().map(this::toDto).toList();
        response.occupiedTableIDs = occupied;
        response.recommendedTableIDs = (best == null) ? List.of() : List.of(best.getId());
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
