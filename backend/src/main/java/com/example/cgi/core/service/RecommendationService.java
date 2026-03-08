package com.example.cgi.core.service;

import com.example.cgi.core.domain.Booking;
import com.example.cgi.core.domain.Preference;
import com.example.cgi.core.domain.Table;
import com.example.cgi.core.domain.Zone;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private static final int PREFERENCE_MATCH_SCORE = 5;
    private static final int MERGED_TABLE_PENALTY = 2;

    public List<Long> recommendTables(
            List<Table> tables,
            List<Booking> bookings,
            int partySize,
            LocalDateTime start,
            LocalDateTime end,
            Set<Preference> preferences,
            Zone zone
    ) {
        List<Table> available = tables.stream()
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
                .filter(b -> Objects.equals(b.getTableId(), table.getId()))
                .noneMatch(b -> b.overlaps(start, end));
    }

    private int scoreSingle(Table table, int partySize, Set<Preference> preferences) {
        int score = 0;
        score -= (table.getCapacity() - partySize);

        for (Preference p : preferences) {
            if (table.getPreferences().contains(p)) {
                score += PREFERENCE_MATCH_SCORE;
            }
        }

        return score;
    }

    private int scorePair(Table a, Table b, int partySize, Set<Preference> preferences) {
        int totalCapacity = a.getCapacity() + b.getCapacity();

        int score = 0;
        score -= (totalCapacity - partySize);

        for (Preference p : preferences) {
            if (a.getPreferences().contains(p) || b.getPreferences().contains(p)) {
                score += PREFERENCE_MATCH_SCORE;
            }
        }

        score -= MERGED_TABLE_PENALTY;
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