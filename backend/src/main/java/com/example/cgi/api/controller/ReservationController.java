package com.example.cgi.api.controller;

import com.example.cgi.api.dto.SearchRequest;
import com.example.cgi.api.dto.SearchResponse;
import com.example.cgi.core.service.ReservationSearchService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping
public class ReservationController {

    private final ReservationSearchService reservationSearchService;

    public ReservationController(ReservationSearchService reservationSearchService) {
        this.reservationSearchService = reservationSearchService;
    }

    @PostMapping("/search")
    public SearchResponse search(@RequestBody @Valid SearchRequest request) {
        return reservationSearchService.search(request);
    }
}