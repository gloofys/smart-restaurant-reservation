package com.example.cgi.core.domain;

import java.util.Set;

public class Table {
    private final Long id;
    private final int capacity;
    private final Zone zone;
    private final Set<Preference> preferences;

    private int x;
    private int y;

    private final Set<Long> mergeableWith;

    public Table(long id,
                 int capacity,
                 Zone zone,
                 Set<Preference> preferences,
                 int x,
                 int y,
                 Set<Long> mergeableWith) {
        this.id = id;
        this.capacity = capacity;
        this.zone = zone;
        this.preferences = preferences;
        this.x = x;
        this.y = y;
        this.mergeableWith = mergeableWith;
    }

    public long getId() { return id; }
    public int getCapacity() { return capacity; }
    public Zone getZone() { return zone; }
    public Set<Preference> getPreferences() { return preferences; }
    public int getX() { return x; }
    public int getY() { return y; }
    public Set<Long> getMergeableWith() { return mergeableWith; }

    public void setPosition(int x, int y) {
        this.x = x;
        this.y = y;
    }
}