package com.example.cgi.api.dto;

import com.example.cgi.core.domain.Preference;
import com.example.cgi.core.domain.Zone;

import java.time.LocalDateTime;
import java.util.Set;

public class SearchRequest {
    public LocalDateTime start;
    public Integer durationMinutes;
    public Integer partySize;
    public Zone Zone;
    public Set<Preference> preferences;
}
