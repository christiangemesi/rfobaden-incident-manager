package ch.rfobaden.incidentmanager.backend.test.generators.base;

import ch.rfobaden.incidentmanager.backend.TestConfig;
import ch.rfobaden.incidentmanager.backend.models.Model;
import com.github.javafaker.Faker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@Import(TestConfig.class)
public abstract class ModelGenerator<T extends Model> extends Generator<T> {
    @Autowired
    protected Faker faker;

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
            storedRecord.setCreatedAt(
                LocalDateTime.now().minusDays(faker.random().nextInt(0, 365 * 1000))
            );
        }
        storedRecord.setUpdatedAt(
            LocalDateTime.now().minusDays(faker.random().nextInt(0, 365 * 1000))
        );
        return storedRecord;
    }
}
