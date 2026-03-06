package com.example.cgi.persistence.memory;

import com.example.cgi.core.domain.Booking;
import com.example.cgi.core.domain.Table;
import com.example.cgi.persistence.repository.BookingRepository;
import com.example.cgi.persistence.repository.TableRepository;
import org.springframework.stereotype.Repository;

import java.time.*;
import java.util.*;

@Repository
public class MemoryBookingRepository implements BookingRepository {

    private final List<Booking> bookings = new ArrayList<>();
    private final Random random = new Random(42);

    private static final int DAYS_TO_SEED = 90;

    private static final int MIN_DURATION_MIN = 120;
    private static final int MAX_DURATION_MIN = 180;

    public MemoryBookingRepository(TableRepository tableRepository) {
        seedForNextDays(LocalDate.now(), DAYS_TO_SEED, tableRepository.findAll());
    }

    private void seedForNextDays(LocalDate startDate, int days, List<Table> tables) {
        for (int i = 0; i < days; i++) {
            LocalDate date = startDate.plusDays(i);
            seedForDate(date, tables);
        }
    }

    private void seedForDate(LocalDate date, List<Table> tables) {

        List<LocalTime> slots = List.of(
                LocalTime.of(12, 0),
                LocalTime.of(13, 30),
                LocalTime.of(18, 0),
                LocalTime.of(19, 0),
                LocalTime.of(20, 0)
        );

        double dayMultiplier = isWeekend(date) ? 1.05 : 1.0;

        Map<Long, List<TimeInterval>> bookedByTable = new HashMap<>();
        for (Table t : tables) bookedByTable.put(t.getId(), new ArrayList<>());

        for (Table table : tables) {
            for (LocalTime slot : slots) {

                double baseP = isDinner(slot) ? 0.22 : 0.15;
                double p = clamp01(baseP * dayMultiplier);

                if (random.nextDouble() > p) continue;


                int offsetMin = random.nextInt(31);
                LocalDateTime start = LocalDateTime.of(date, slot).plusMinutes(offsetMin);

                int duration = MIN_DURATION_MIN + random.nextInt(MAX_DURATION_MIN - MIN_DURATION_MIN + 1);
                LocalDateTime end = start.plusMinutes(duration);


                if (overlapsAny(bookedByTable.get(table.getId()), start.toLocalTime(), end.toLocalTime())) {
                    continue;
                }

                int partySize = realisticPartySize(table.getCapacity());
                bookings.add(new Booking(table.getId(), start, end, partySize));
                bookedByTable.get(table.getId()).add(new TimeInterval(start.toLocalTime(), end.toLocalTime()));
            }
        }
    }

    private int realisticPartySize(int capacity) {
        int[] weights;
        int[] sizes;

        if (capacity <= 2) {
            sizes = new int[]{1, 2};
            weights = new int[]{30, 70};
        } else if (capacity <= 4) {
            sizes = new int[]{2, 3, 4};
            weights = new int[]{45, 25, 30};
        } else if (capacity <= 6) {
            sizes = new int[]{2, 4, 5, 6};
            weights = new int[]{35, 35, 15, 15};
        } else {
            sizes = new int[]{2, 4, 6, 8};
            weights = new int[]{30, 35, 20, 15};
        }

        int pick = weightedPick(sizes, weights);
        return Math.min(pick, capacity);
    }

    private int weightedPick(int[] values, int[] weights) {
        int total = 0;
        for (int w : weights) total += w;
        int r = random.nextInt(total);
        int acc = 0;
        for (int i = 0; i < values.length; i++) {
            acc += weights[i];
            if (r < acc) return values[i];
        }
        return values[values.length - 1];
    }

    private boolean overlapsAny(List<TimeInterval> intervals, LocalTime start, LocalTime end) {
        for (TimeInterval it : intervals) {
            if (it.overlaps(start, end)) return true;
        }
        return false;
    }

    private boolean isDinner(LocalTime t) {
        return !t.isBefore(LocalTime.of(17, 0));
    }

    private boolean isWeekend(LocalDate d) {
        DayOfWeek w = d.getDayOfWeek();
        return w == DayOfWeek.SATURDAY || w == DayOfWeek.SUNDAY;
    }

    private double clamp01(double x) {
        return Math.max(0.0, Math.min(1.0, x));
    }

    private record TimeInterval(LocalTime start, LocalTime end) {
        boolean overlaps(LocalTime s, LocalTime e) {
            return start.isBefore(e) && s.isBefore(end);
        }
    }

    @Override
    public List<Booking> findAll() {
        return List.copyOf(bookings);
    }

    @Override
    public void save(Booking booking) {
        bookings.add(booking);
    }
}