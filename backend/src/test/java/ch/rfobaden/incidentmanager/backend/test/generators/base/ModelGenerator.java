package ch.rfobaden.incidentmanager.backend.test.generators.base;

import ch.rfobaden.incidentmanager.backend.models.Model;

import java.util.List;

/**
 * {@code ModelGenerator} is an abstract base class for {@link Generator} implementations
 * for {@link Model} values.
 *
 * @param <T> The type of the generated values.
 */
public abstract class ModelGenerator<T extends Model> extends Generator<T> {
    /**
     * The next generated id.
     */
    private Long nextId = 0L;

    /**
     * Generates a random id value.
     * The id is guaranteed to be unique to this generator.
     *
     * @return The generated id.
     */
    public final Long generateId() {
        return nextId++;
    }

    /**
     * Generates a {@link #persist(T) persisted} value.
     *
     * @return The generated value.
     */
    @Override
    public T generate() {
        return persist(generateNew());
    }

    /**
     * Generates a new, unpersisted value.
     *
     * @return The generated value.
     */
    public abstract T generateNew();

    /**
     * Generates a list of new, unpersisted values.
     *
     * @param amount The amount of values to generate.
     * @return The list of generated values.
     */
    public final List<T> generateNew(int amount) {
        return generate(amount, this::generateNew);
    }

    /**
     * Creates a copy of a value that appears as if it was persisted by a repository.
     * This includes giving it an id, and setting its {@link Model#createdAt}
     * and {@link Model#updatedAt} fields.
     *
     * @param record The value to persist.
     * @return A persisted copy of {@code record}.
     */
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
