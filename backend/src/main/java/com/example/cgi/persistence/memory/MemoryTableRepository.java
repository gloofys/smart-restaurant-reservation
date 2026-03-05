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
        add(new Table(2,2, Zone.MAIN_HALL, EnumSet.of(Preference.WINDOW), 260, 100, Set.of(1L)));

        add(new Table(3,4, Zone.MAIN_HALL, EnumSet.of(Preference.QUIET), 120, 220, Set.of(4L)));
        add(new Table(4,4, Zone.MAIN_HALL, EnumSet.of(Preference.QUIET), 260, 220, Set.of(3L,5L)));

        add(new Table(5,6, Zone.MAIN_HALL, EnumSet.noneOf(Preference.class), 200, 340, Set.of(4L)));
        add(new Table(6, 2, Zone.MAIN_HALL, EnumSet.of(Preference.NEAR_PLAY_AREA), 120, 470, Set.of(7L)));
        add(new Table(7, 4, Zone.MAIN_HALL, EnumSet.of(Preference.NEAR_PLAY_AREA), 220, 470, Set.of(6L)));

        add(new Table(8,2, Zone.TERRACE, EnumSet.of(Preference.WINDOW), 520, 100, Set.of(9L)));
        add(new Table(9,4, Zone.TERRACE, EnumSet.of(Preference.WINDOW), 640, 100, Set.of(8L, 10L)));

        add(new Table(10,6, Zone.TERRACE, EnumSet.noneOf(Preference.class), 580, 220, Set.of(9L)));

        add(new Table(11,8, Zone.PRIVATE_ROOM, EnumSet.of(Preference.QUIET), 560, 360, Set.of(12L)));
        add(new Table(12,4, Zone.PRIVATE_ROOM, EnumSet.of(Preference.QUIET), 720, 360, Set.of(11L)));
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
