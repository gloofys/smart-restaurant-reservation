package com.example.cgi.persistence.memory;

import com.example.cgi.core.domain.Zone;
import com.example.cgi.core.domain.Table;
import com.example.cgi.core.domain.Preference;
import com.example.cgi.persistence.repository.TableRepository;

import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class MemoryTableRepository implements TableRepository{

    private final Map<Long , Table> tablesById = new LinkedHashMap<>();

    public MemoryTableRepository() {
        seed();
    }

    private void seed() {
        add(new Table(1,2, Zone.MAIN_HALL, EnumSet.of(Preference.WINDOW), 120, 100, Set.of(2L)));
        add(new Table(2,2, Zone.MAIN_HALL, EnumSet.of(Preference.WINDOW), 360, 100, Set.of(1L)));

        add(new Table(3,4, Zone.MAIN_HALL, EnumSet.of(Preference.WINDOW), 120, 200, Set.of(4L, 5L)));
        add(new Table(4,4, Zone.MAIN_HALL, EnumSet.noneOf(Preference.class), 360, 200, Set.of(3L,6L)));

        add(new Table(5,6, Zone.MAIN_HALL, EnumSet.of(Preference.WINDOW), 120, 310, Set.of(4L, 6L)));
        add(new Table(6,6, Zone.MAIN_HALL, EnumSet.noneOf(Preference.class), 360, 310, Set.of(4L, 8L)));
        add(new Table(7, 2, Zone.MAIN_HALL, EnumSet.of(Preference.NEAR_PLAY_AREA), 120, 400, Set.of(5L)));
        add(new Table(8, 4, Zone.MAIN_HALL, EnumSet.of(Preference.NEAR_PLAY_AREA), 360, 400, Set.of(6L)));

        add(new Table(9,2, Zone.TERRACE, EnumSet.noneOf(Preference.class), 520, 100, Set.of(10L, 11L)));
        add(new Table(10,4, Zone.TERRACE, EnumSet.noneOf(Preference.class), 700, 100, Set.of(9L, 12L)));
        add(new Table(11,6, Zone.TERRACE, EnumSet.noneOf(Preference.class), 520, 220, Set.of(9L, 12L)));
        add(new Table(12,6, Zone.TERRACE, EnumSet.noneOf(Preference.class), 700, 220, Set.of(10L, 11L)));

        add(new Table(13,8, Zone.PRIVATE_ROOM, EnumSet.of(Preference.QUIET), 560, 350, Set.of(14L, 15L)));
        add(new Table(14,4, Zone.PRIVATE_ROOM, EnumSet.of(Preference.QUIET, Preference.WINDOW), 740, 350, Set.of(13L, 16L)));
        add(new Table(15,4, Zone.PRIVATE_ROOM, EnumSet.of(Preference.QUIET), 560, 450, Set.of(13L, 16L)));
        add(new Table(16,6, Zone.PRIVATE_ROOM, EnumSet.of(Preference.QUIET, Preference.WINDOW), 740, 450, Set.of(14L, 15L)));
    }

    private void add(Table table) {
        tablesById.put(table.getId(), table);
    }
    @Override
    public List<Table> findAll() {
        return new ArrayList<>(tablesById.values());
    }

    @Override
    public Optional<Table> findById(Long id) {
        return Optional.ofNullable(tablesById.get(id));
    }
}
