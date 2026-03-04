package com.example.cgi.persistence.memory;

import com.example.cgi.core.domain.Booking;
import com.example.cgi.core.domain.Table;
import com.example.cgi.persistence.repository.BookingRepository;
import com.example.cgi.persistence.repository.TableRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Repository
public class MemoryBookingRepository implements BookingRepository {

    private final List<Booking> bookings = new ArrayList<>();
    private final Random random = new Random(42);

    public MemoryBookingRepository(TableRepository tableRepository) {
        seedRandomBookings(tableRepository.findAll());
    }

    private void seedRandomBookings(List<Table> tables) {
        seedForDate(LocalDate.now(), tables);
        seedForDate(LocalDate.now().plusDays(1), tables);
    }

    private void seedForDate(LocalDate date, List<Table> tables){
        List<LocalTime> timeslots = List.of(
                LocalTime.of(12, 0),
                LocalTime.of(13, 0),
                LocalTime.of(14, 0),
                LocalTime.of(18, 0),
                LocalTime.of(19, 0),
                LocalTime.of(20, 0)
        );

        int bookingsToCreate = Math.min(10, tables.size());

        for (int i = 0; i < bookingsToCreate; i++) {
            Table table = tables.get(random.nextInt(tables.size()));
            LocalTime startTime = timeslots.get(random.nextInt(timeslots.size()));
            LocalDateTime startDateTime = LocalDateTime.of(date, startTime);
            LocalDateTime endDateTime = startDateTime.plusHours(2).plusMinutes(30);

            int partySize = Math.min(table.getCapacity(), 2 + random.nextInt(Math.max(1, table.getCapacity() - 1)));
            bookings.add(new Booking(table.getId(), startDateTime, endDateTime, partySize));
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

