package ch.rfobaden.incidentmanager.backend.test.generators.base;

import ch.rfobaden.incidentmanager.backend.models.Model;

import java.util.List;

public abstract class ModelGenerator<T extends Model> extends Generator<T> {
    public final Long generateId() {
        return faker.number().numberBetween(1, Long.MAX_VALUE);
    }

    @Override
    public T generate() {
        return persist(generateNew());
    }

    public abstract T generateNew();

    public final List<T> generateNew(int amount) {
        return generate(amount, this::generateNew);
    }

    public T persist(T record) {
        var storedRecord = copy(record);
        if (record.getId() == null) {
            storedRecord.setId(generateId());
        }
        if (record.getCreatedAt() == null) {
            storedRecord.setCreatedAt(randomDateTime());
        }
        storedRecord.setUpdatedAt(randomDateTime());
        return storedRecord;
    }
}
