package com.example.cgi.core.domain;

import java.time.LocalDateTime;
public class Booking {
    private final long tableId;
    private final LocalDateTime startTime;
    private final LocalDateTime endTime;
    public final int partySize;

    public Booking(long tableId, LocalDateTime startTime, LocalDateTime endTime, int partySize) {
        this.tableId = tableId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.partySize = partySize;
    }

    public long getTableId() {
        return tableId;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public int getPartySize() {
        return partySize;
    }
}
