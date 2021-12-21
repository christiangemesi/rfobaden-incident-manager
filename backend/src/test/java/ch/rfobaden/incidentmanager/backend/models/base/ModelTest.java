package ch.rfobaden.incidentmanager.backend.models.base;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import ch.rfobaden.incidentmanager.backend.models.Model;
import ch.rfobaden.incidentmanager.backend.test.generators.base.Generator;
import org.junit.jupiter.api.RepeatedTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Repeat;

public abstract class ModelTest<T extends Model> extends PojoTest<T> {
    @Autowired
    protected Generator<T> generator;

    @Override
    protected T generate() {
        return generator.generate();
    }

    @RepeatedTest(5)
    public void testEquals_copy() {
        // Given
        var value = generator.generate();
        var valueCopy = generator.copy(value);

        // Then
        assertThat(value).isEqualTo(valueCopy);
        assertThat(valueCopy).isEqualTo(value);
    }
}
