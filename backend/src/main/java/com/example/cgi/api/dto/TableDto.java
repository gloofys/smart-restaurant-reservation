package com.example.cgi.api.dto;

import com.example.cgi.core.domain.Preference;
import com.example.cgi.core.domain.Zone;

import java.util.Set;

public class TableDto {
    public Long id;
    public int capacity;
    public Zone zone;
    public Set<Preference> preferences;
    public int x;
    public int y;
}
