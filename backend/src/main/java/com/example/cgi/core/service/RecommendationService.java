package com.example.cgi.core.service;

import com.example.cgi.core.domain.Booking;
import com.example.cgi.core.domain.Preference;
import com.example.cgi.core.domain.Table;
import com.example.cgi.core.domain.Zone;
import com.example.cgi.persistence.repository.BookingRepository;
import com.example.cgi.persistence.repository.TableRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {
    private final TableRepository tableRepository;
    private final BookingRepository bookingRepository;

    public RecommendationService(TableRepository tableRepository,
                                 BookingRepository bookingRepository) {
        this.tableRepository = tableRepository;
        this.bookingRepository = bookingRepository;
    }

    /**
     * Returns recommended table IDs.
     * - If one table fits: returns [tableId]
     * - Else tries a mergeable pair: returns [id1, id2]
     * - Else: returns empty list
     */
    public List<Long> recommendTables(
            int partySize,
            LocalDateTime start,
            LocalDateTime end,
            Set<Preference> preferences,
            Zone zone // null => any zone
    ) {
        List<Table> allTables = tableRepository.findAll();
        List<Booking> bookings = bookingRepository.findAll();

        List<Table> available = allTables.stream()
                .filter(t -> zone == null || t.getZone() == zone)
                .filter(t -> isAvailable(t, bookings, start, end))
                .toList();

        Table bestSingle = available.stream()
                .filter(t -> t.getCapacity() >= partySize)
                .max(Comparator.comparingInt(t -> scoreSingle(t, partySize, preferences)))
                .orElse(null);

        if (bestSingle != null) {
            return List.of(bestSingle.getId());
        }

        List<Long> bestPair = bestMergeablePair(available, partySize, preferences);
        return bestPair == null ? List.of() : bestPair;
    }

    private boolean isAvailable(Table table, List<Booking> bookings, LocalDateTime start, LocalDateTime end) {
        return bookings.stream()
                .filter(b -> Objects.equals(b.getTableId(), table.getId())) // IMPORTANT: equals for Long
                .noneMatch(b -> b.overlaps(start, end));
    }

    private int scoreSingle(Table table, int partySize, Set<Preference> preferences) {
        int score = 0;

        score -= (table.getCapacity() - partySize);

        for (Preference p : preferences) {
            if (table.getPreferences().contains(p)) score += 5;
        }

        return score;
    }

    private int scorePair(Table a, Table b, int partySize, Set<Preference> preferences) {
        int totalCapacity = a.getCapacity() + b.getCapacity();

        int score = 0;

        score -= (totalCapacity - partySize);

        for (Preference p : preferences) {
            if (a.getPreferences().contains(p) || b.getPreferences().contains(p)) score += 5;
        }

        score -= 2;

        return score;
    }

    private List<Long> bestMergeablePair(List<Table> available, int partySize, Set<Preference> preferences) {
        Map<Long, Table> byId = available.stream()
                .collect(Collectors.toMap(Table::getId, t -> t));

        int bestScore = Integer.MIN_VALUE;
        List<Long> best = null;

        for (Table t1 : available) {
            for (Long otherId : t1.getMergeableWith()) {
                Table t2 = byId.get(otherId);
                if (t2 == null) continue;

                if (t1.getId() > t2.getId()) continue;

                int totalCapacity = t1.getCapacity() + t2.getCapacity();
                if (totalCapacity < partySize) continue;

                int score = scorePair(t1, t2, partySize, preferences);
                if (score > bestScore) {
                    bestScore = score;
                    best = List.of(t1.getId(), t2.getId());
                }
            }
        }

        return best;
    }
}