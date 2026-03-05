package com.example.cgi.core.service;

import com.example.cgi.core.domain.Booking;
import com.example.cgi.core.domain.Preference;
import com.example.cgi.core.domain.Table;
import com.example.cgi.persistence.repository.BookingRepository;
import com.example.cgi.persistence.repository.TableRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Set;


@Service
public class RecommendationService {
    private final TableRepository tableRepository;
    private final BookingRepository bookingRepository;

    public RecommendationService(TableRepository tableRepository,
                                 BookingRepository bookingRepository) {
        this.tableRepository = tableRepository;
        this.bookingRepository = bookingRepository;
    }

    public Table recommendTable(int partySize,
                                LocalDateTime start,
                                LocalDateTime end,
                                Set<Preference> preferences) {

        List<Table> tables = tableRepository.findAll();
        List<Booking> bookings = bookingRepository.findAll();

        return tables.stream()


                .filter(t -> t.getCapacity() >= partySize)


                .filter(table ->
                        bookings.stream()
                                .filter(b -> b.getTableId() == table.getId())
                                .noneMatch(b -> b.overlaps(start, end))
                )
//ai stream api
                .max(Comparator.comparingInt(t ->
                        scoreTable(t, partySize, preferences)))
                .orElse(null);
    }

    private int scoreTable(Table table,
                           int partySize,
                           Set<Preference> preferences) {

        int score = 0;


        score -= (table.getCapacity() - partySize);


        for (Preference p : preferences) {
            if (table.getPreferences().contains(p)) {
                score += 5;
            }
        }

        return score;
    }
}
