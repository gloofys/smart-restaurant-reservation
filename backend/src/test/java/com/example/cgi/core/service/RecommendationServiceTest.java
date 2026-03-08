package com.example.cgi.core.service;

import com.example.cgi.core.domain.Booking;
import com.example.cgi.core.domain.Preference;
import com.example.cgi.core.domain.Table;
import com.example.cgi.core.domain.Zone;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;

class RecommendationServiceTest {

    private RecommendationService recommendationService;

    @BeforeEach
    void setUp() {
        recommendationService = new RecommendationService();
    }

    @Test
    void shouldRecommendBestSingleTableMatchingPreferences() {
        LocalDateTime start = LocalDateTime.of(2026, 3, 7, 18, 0);
        LocalDateTime end = start.plusMinutes(120);

        Table table1 = new Table(1, 4, Zone.MAIN_HALL, EnumSet.of(Preference.WINDOW), 120, 100, Set.of());

        Table table2 = new Table(2, 6, Zone.MAIN_HALL, EnumSet.noneOf(Preference.class), 200, 100, Set.of());

        List<Long> result = recommendationService.recommendTables(List.of(table1, table2), List.of(), 4, start, end, Set.of(Preference.WINDOW), Zone.MAIN_HALL);

        assertEquals(List.of(1L), result);
    }

    @Test
    void shouldIgnoreOccupiedSingleTableAndRecommendAnotherAvailableOne() {
        LocalDateTime start = LocalDateTime.of(2026, 3, 7, 18, 0);
        LocalDateTime end = start.plusMinutes(120);

        Table table1 = new Table(1, 4, Zone.MAIN_HALL, EnumSet.of(Preference.WINDOW), 120, 100, Set.of());

        Table table2 = new Table(2, 4, Zone.MAIN_HALL, EnumSet.noneOf(Preference.class), 200, 100, Set.of());

        Booking booking = new Booking(1L, LocalDateTime.of(2026, 3, 7, 18, 0), LocalDateTime.of(2026, 3, 7, 20, 0), 4);

        List<Long> result = recommendationService.recommendTables(List.of(table1, table2), List.of(booking), 4, start, end, Set.of(Preference.WINDOW), Zone.MAIN_HALL);

        assertEquals(List.of(2L), result);
    }

    @Test
    void shouldRecommendMergeablePairWhenNoSingleTableIsLargeEnough() {
        LocalDateTime start = LocalDateTime.of(2026, 3, 7, 18, 0);
        LocalDateTime end = start.plusMinutes(120);

        Table table1 = new Table(1, 4, Zone.MAIN_HALL, EnumSet.of(Preference.WINDOW), 120, 100, Set.of(2L));

        Table table2 = new Table(2, 4, Zone.MAIN_HALL, EnumSet.noneOf(Preference.class), 200, 100, Set.of(1L));

        Table table3 = new Table(3, 2, Zone.MAIN_HALL, EnumSet.noneOf(Preference.class), 300, 100, Set.of());

        List<Long> result = recommendationService.recommendTables(List.of(table1, table2, table3), List.of(), 8, start, end, Set.of(Preference.WINDOW), Zone.MAIN_HALL);

        assertEquals(List.of(1L, 2L), result);
    }

    @Test
    void shouldReturnEmptyListWhenNoSingleOrPairCanFitParty() {
        LocalDateTime start = LocalDateTime.of(2026, 3, 7, 18, 0);
        LocalDateTime end = start.plusMinutes(120);

        Table table1 = new Table(1, 4, Zone.MAIN_HALL, EnumSet.noneOf(Preference.class), 120, 100, Set.of());

        Table table2 = new Table(2, 4, Zone.MAIN_HALL, EnumSet.noneOf(Preference.class), 200, 100, Set.of());

        List<Long> result = recommendationService.recommendTables(List.of(table1, table2), List.of(), 10, start, end, Set.of(), Zone.MAIN_HALL);

        assertEquals(List.of(), result);
    }

    @Test
    void shouldOnlyRecommendTablesFromRequestedZone() {
        LocalDateTime start = LocalDateTime.of(2026, 3, 7, 18, 0);
        LocalDateTime end = start.plusMinutes(120);

        Table mainHallTable = new Table(1, 4, Zone.MAIN_HALL, EnumSet.of(Preference.WINDOW), 120, 100, Set.of());

        Table terraceTable = new Table(2, 4, Zone.TERRACE, EnumSet.noneOf(Preference.class), 200, 100, Set.of());

        List<Long> result = recommendationService.recommendTables(List.of(mainHallTable, terraceTable), List.of(), 4, start, end, Set.of(), Zone.TERRACE);

        assertEquals(List.of(2L), result);
    }
}