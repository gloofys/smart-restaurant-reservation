package com.example.cgi.core.service;

import com.example.cgi.core.domain.Booking;
import com.example.cgi.core.domain.Preference;
import com.example.cgi.core.domain.Table;
import com.example.cgi.core.domain.Zone;
import com.example.cgi.persistence.repository.BookingRepository;
import com.example.cgi.persistence.repository.TableRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;

class RecommendationServiceTest {

    private FakeTableRepository tableRepository;
    private FakeBookingRepository bookingRepository;
    private RecommendationService recommendationService;

    @BeforeEach
    void setUp() {
        tableRepository = new FakeTableRepository();
        bookingRepository = new FakeBookingRepository();
        recommendationService = new RecommendationService(tableRepository, bookingRepository);
    }

    @Test
    void shouldRecommendBestSingleTableWhenAvailable() {
        tableRepository.setTables(List.of(
                new Table(1, 2, Zone.MAIN_HALL, EnumSet.noneOf(Preference.class), 0, 0, Set.of()),
                new Table(2, 4, Zone.MAIN_HALL, EnumSet.of(Preference.WINDOW), 0, 0, Set.of()),
                new Table(3, 6, Zone.MAIN_HALL, EnumSet.noneOf(Preference.class), 0, 0, Set.of())
        ));

        List<Long> result = recommendationService.recommendTables(
                4,
                LocalDateTime.of(2026, 3, 7, 18, 0),
                LocalDateTime.of(2026, 3, 7, 20, 0),
                Set.of(Preference.WINDOW),
                Zone.MAIN_HALL
        );

        assertEquals(List.of(2L), result);
    }

    @Test
    void shouldIgnoreBookedTables() {
        tableRepository.setTables(List.of(
                new Table(1, 4, Zone.MAIN_HALL, EnumSet.of(Preference.WINDOW), 0, 0, Set.of()),
                new Table(2, 6, Zone.MAIN_HALL, EnumSet.noneOf(Preference.class), 0, 0, Set.of())
        ));

        bookingRepository.setBookings(List.of(
                new Booking(
                        1L,
                        LocalDateTime.of(2026, 3, 7, 18, 0),
                        LocalDateTime.of(2026, 3, 7, 20, 0),
                        2
                )
        ));

        List<Long> result = recommendationService.recommendTables(
                4,
                LocalDateTime.of(2026, 3, 7, 18, 30),
                LocalDateTime.of(2026, 3, 7, 19, 30),
                Set.of(Preference.WINDOW),
                Zone.MAIN_HALL
        );

        assertEquals(List.of(2L), result);
    }

    @Test
    void shouldRecommendMergeablePairWhenSingleTableIsNotEnough() {
        tableRepository.setTables(List.of(
                new Table(1, 4, Zone.MAIN_HALL, EnumSet.noneOf(Preference.class), 0, 0, Set.of(2L)),
                new Table(2, 4, Zone.MAIN_HALL, EnumSet.of(Preference.WINDOW), 0, 0, Set.of(1L)),
                new Table(3, 6, Zone.MAIN_HALL, EnumSet.noneOf(Preference.class), 0, 0, Set.of())
        ));

        List<Long> result = recommendationService.recommendTables(
                8,
                LocalDateTime.of(2026, 3, 7, 18, 0),
                LocalDateTime.of(2026, 3, 7, 20, 0),
                Set.of(Preference.WINDOW),
                Zone.MAIN_HALL
        );

        assertEquals(List.of(1L, 2L), result);
    }

    @Test
    void shouldReturnEmptyListWhenNoSuitableTableOrPairExists() {
        tableRepository.setTables(List.of(
                new Table(1, 2, Zone.MAIN_HALL, EnumSet.noneOf(Preference.class), 0, 0, Set.of()),
                new Table(2, 2, Zone.MAIN_HALL, EnumSet.noneOf(Preference.class), 0, 0, Set.of())
        ));

        List<Long> result = recommendationService.recommendTables(
                10,
                LocalDateTime.of(2026, 3, 7, 18, 0),
                LocalDateTime.of(2026, 3, 7, 20, 0),
                Set.of(),
                Zone.MAIN_HALL
        );

        assertEquals(List.of(), result);
    }

    @Test
    void shouldFilterByZone() {
        tableRepository.setTables(List.of(
                new Table(1, 4, Zone.MAIN_HALL, EnumSet.noneOf(Preference.class), 0, 0, Set.of()),
                new Table(2, 4, Zone.TERRACE, EnumSet.of(Preference.WINDOW), 0, 0, Set.of())
        ));

        List<Long> result = recommendationService.recommendTables(
                4,
                LocalDateTime.of(2026, 3, 7, 18, 0),
                LocalDateTime.of(2026, 3, 7, 20, 0),
                Set.of(Preference.WINDOW),
                Zone.TERRACE
        );

        assertEquals(List.of(2L), result);
    }

    private static class FakeTableRepository implements TableRepository {
        private List<Table> tables = new ArrayList<>();

        void setTables(List<Table> tables) {
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
        private List<Booking> bookings = new ArrayList<>();

        void setBookings(List<Booking> bookings) {
            this.bookings = bookings;
        }

        @Override
        public List<Booking> findAll() {
            return bookings;
        }

        @Override
        public void save(Booking booking) {
            bookings.add(booking);
        }
    }
}