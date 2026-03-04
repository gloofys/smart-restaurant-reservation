package com.example.cgi.persistence.repository;

import com.example.cgi.core.domain.Booking;

import java.util.List;


public interface BookingRepository {

    List<Booking> findAll();

    void save(Booking booking);

}
