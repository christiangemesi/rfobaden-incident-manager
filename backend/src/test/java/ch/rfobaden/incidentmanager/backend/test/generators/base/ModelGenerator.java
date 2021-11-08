package ch.rfobaden.incidentmanager.backend.test.generators.base;

import ch.rfobaden.incidentmanager.backend.TestConfig;
import ch.rfobaden.incidentmanager.backend.models.Model;
import com.github.javafaker.Faker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.stereotype.Component;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.function.Supplier;

@Component
@Import(TestConfig.class)
public abstract class ModelGenerator<T extends Model> {
    @Autowired
    protected Faker faker;

    public final Long generateId() {
        return faker.number().numberBetween(1, Long.MAX_VALUE);
    }

    public abstract T generateNew();

    public final List<T> generateNew(int amount) {
        return generate(amount, this::generateNew);
    }

    public final T generatePersisted() {
        return persist(generateNew());
    }

    public final List<T> generatePersisted(int amount) {
        return generate(amount, this::generatePersisted);
    }

    public T persist(T record) {
        var storedRecord = copy(record);
        if (record.getId() == null) {
            storedRecord.setId(generateId());
        }
        if (record.getCreatedAt() == null) {
            storedRecord.setCreatedAt(
                LocalDateTime.now().minusDays(faker.random().nextInt(0, 365 * 1000))
            );
        }
        storedRecord.setUpdatedAt(
            LocalDateTime.now().minusDays(faker.random().nextInt(0, 365 * 1000))
        );
        return storedRecord;
    }

    private List<T> generate(int amount, Supplier<T> generate) {
        var records = new ArrayList<T>(amount);
        for (int i = 0; i < amount; i++) {
            records.add(generate.get());
        }
        return records;
    }

    /**
     * Shallow copy of a record, using reflection.
     * Not very pretty, not entirely safe, definitely only usable in testing.
     *
     * <p>
     * This could be made abstract if we ever want to move away from the unsafe,
     * reflection-based type of copying.
     * </p>
     *
     * @param record the record to copy
     *
     * @return a shallow copy of {@code record}
     */
    public final T copy(T record) {
        try {

            Constructor<T> defaultConstructor = null;
            @SuppressWarnings("unchecked") var constructors =
                (Constructor<T>[]) record.getClass().getConstructors();
            for (var constructor : constructors) {
                if (constructor.getParameterCount() == 0) {
                    defaultConstructor = constructor;
                    break;
                }
            }
            if (defaultConstructor == null) {
                throw new IllegalStateException("can't copy without a default constructor");
            }
            var newRecord = defaultConstructor.newInstance();
            var methods = record.getClass().getMethods();
            Arrays.stream(methods)
                .filter(method -> method.getName().startsWith("get"))
                .filter(method -> method.getParameterCount() == 0)
                .forEach(getter -> {
                    var fieldName = getter.getName().substring(3);
                    var setter = Arrays.stream(methods)
                        .filter(method -> method.getName().startsWith("set" + fieldName))
                        .filter(method -> method.getParameterCount() == 1)
                        .findFirst()
                        .orElse(null);
                    if (setter == null) {
                        return;
                    }
                    try {
                        var value = getter.invoke(record);
                        setter.invoke(newRecord, value);
                    } catch (IllegalAccessException | InvocationTargetException e) {
                        throw new IllegalStateException("failed to copy " + fieldName);
                    }
                });
            return newRecord;
        } catch (InstantiationException | IllegalAccessException | InvocationTargetException e) {
            throw new IllegalStateException("failed to copy", e);
        }
    }
}
