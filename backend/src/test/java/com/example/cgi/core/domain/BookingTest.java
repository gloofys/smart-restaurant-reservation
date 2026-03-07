package com.example.cgi.core.domain;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class BookingTest {

    @Test
    void shouldReturnTrueWhenBookingsOverlap() {
        Booking booking = new Booking(
                1L,
                LocalDateTime.of(2026, 3, 7, 18, 0),
                LocalDateTime.of(2026, 3, 7, 20, 0),
                2
        );

        boolean overlaps = booking.overlaps(
                LocalDateTime.of(2026, 3, 7, 19, 0),
                LocalDateTime.of(2026, 3, 7, 21, 0)
        );

        assertTrue(overlaps);
    }

    @Test
    void shouldReturnFalseWhenBookingsDoNotOverlap() {
        Booking booking = new Booking(
                1L,
                LocalDateTime.of(2026, 3, 7, 18, 0),
                LocalDateTime.of(2026, 3, 7, 20, 0),
                2
        );

        boolean overlaps = booking.overlaps(
                LocalDateTime.of(2026, 3, 7, 20, 0),
                LocalDateTime.of(2026, 3, 7, 22, 0)
        );

        assertFalse(overlaps);
    }

    @Test
    void shouldReturnTrueWhenOneRangeIsInsideAnother() {
        Booking booking = new Booking(
                1L,
                LocalDateTime.of(2026, 3, 7, 18, 0),
                LocalDateTime.of(2026, 3, 7, 22, 0),
                4
        );

        boolean overlaps = booking.overlaps(
                LocalDateTime.of(2026, 3, 7, 19, 0),
                LocalDateTime.of(2026, 3, 7, 20, 0)
        );

        assertTrue(overlaps);
    }
}