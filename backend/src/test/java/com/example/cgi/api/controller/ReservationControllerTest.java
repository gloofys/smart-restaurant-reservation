package com.example.cgi.api.controller;

import com.example.cgi.api.dto.SearchRequest;
import com.example.cgi.api.dto.SearchResponse;
import com.example.cgi.core.domain.Booking;
import com.example.cgi.core.domain.Preference;
import com.example.cgi.core.domain.Table;
import com.example.cgi.core.domain.Zone;
import com.example.cgi.core.service.RecommendationService;
import com.example.cgi.core.service.ReservationSearchService;
import com.example.cgi.persistence.repository.BookingRepository;
import com.example.cgi.persistence.repository.TableRepository;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ReservationControllerTest {

    @Test
    void shouldReturnAvailableOccupiedAndRecommendedTables() {
        Table table1 = new Table(1, 4, Zone.MAIN_HALL, EnumSet.of(Preference.WINDOW), 120, 100, Set.of());
        Table table2 = new Table(2, 6, Zone.MAIN_HALL, EnumSet.noneOf(Preference.class), 200, 100, Set.of());

        FakeTableRepository tableRepository = new FakeTableRepository(List.of(table1, table2));

        FakeBookingRepository bookingRepository = new FakeBookingRepository(List.of(
                new Booking(
                        2L,
                        LocalDateTime.of(2026, 3, 7, 18, 0),
                        LocalDateTime.of(2026, 3, 7, 20, 0),
                        4
                )
        ));

        FakeRecommendationService recommendationService = new FakeRecommendationService(List.of(1L));

        ReservationSearchService reservationSearchService = new ReservationSearchService(
                tableRepository,
                bookingRepository,
                recommendationService
        );

        ReservationController controller = new ReservationController(reservationSearchService);

        SearchRequest request = new SearchRequest();
        request.start = LocalDateTime.of(2026, 3, 7, 18, 0);
        request.durationMinutes = 120;
        request.partySize = 4;
        request.zone = Zone.MAIN_HALL;
        request.preferences = Set.of(Preference.WINDOW);

        SearchResponse response = controller.search(request);

        assertEquals(2, response.availableTables.size());
        assertTrue(response.occupiedTableIDs.contains(2L));
        assertEquals(List.of(1L), response.recommendedTableIDs);

        assertEquals(1L, response.availableTables.get(0).id);
        assertEquals(4, response.availableTables.get(0).capacity);
        assertEquals(Zone.MAIN_HALL, response.availableTables.get(0).zone);
    }

    private static class FakeTableRepository implements TableRepository {
        private final List<Table> tables;

        FakeTableRepository(List<Table> tables) {
            this.tables = tables;
        }

        @Override
        public List<Table> findAll() {
            return tables;
        }

        @Override
        public Optional<Table> findById(Long id) {
            return tables.stream().filter(t -> Objects.equals(t.getId(), id)).findFirst();
        }
    }

    private static class FakeBookingRepository implements BookingRepository {
        private final List<Booking> bookings;

        FakeBookingRepository(List<Booking> bookings) {
            this.bookings = bookings;
        }

        @Override
        public List<Booking> findAll() {
            return bookings;
        }

        @Override
        public void save(Booking booking) {
            throw new UnsupportedOperationException("Not needed in this test");
        }
    }

    private static class FakeRecommendationService extends RecommendationService {
        private final List<Long> result;

        FakeRecommendationService(List<Long> result) {
            this.result = result;
        }

        @Override
        public List<Long> recommendTables(
                List<Table> tables,
                List<Booking> bookings,
                int partySize,
                LocalDateTime start,
                LocalDateTime end,
                Set<Preference> preferences,
                Zone zone
        ) {
            return result;
        }
    }
}