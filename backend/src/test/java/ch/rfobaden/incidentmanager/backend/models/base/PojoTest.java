package ch.rfobaden.incidentmanager.backend.models.base;


import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import ch.rfobaden.incidentmanager.backend.TestConfig;
import ch.rfobaden.incidentmanager.backend.test.generators.base.Generator;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

/**
 * Base test class for any kind of POJO's.
 * Tests methods defined on {@link Object}, such as {@link Object#equals(Object) equals}
 * and {@link Object#hashCode()  hashCode}.
 */
@SpringBootTest
@Import(TestConfig.class)
public abstract class PojoTest<T> {
    @Autowired
    protected Generator<T> generator;

    @Test
    public void testEquals_copy() {
        // Given
        var value = generator.generate();
        var valueCopy = generator.copy(value);

        // Then
        assertThat(value).isEqualTo(valueCopy);
        assertThat(valueCopy).isEqualTo(value);
    }

    @Test
    public void testEquals_self() {
        // Given
        var value = generator.generate();

        // When
        var result = value.equals(value);

        // Then
        assertThat(result).isTrue();
    }

    @Test
    public void testEquals_null() {
        // Given
        var value = generator.generate();

        // Then
        assertThat(value).isNotEqualTo(null);
    }

    @Test
    public void testEquals_differentType() {
        // Given
        var value = generator.generate();

        // Then
        assertThat(value).isNotEqualTo(new Object());
    }

    @Test
    public void testEquals_nonEqual() {
        // Given
        var value = generator.generate();
        var otherValue = generator.generate();

        // Then
        assertThat(value).isNotEqualTo(otherValue);
        assertThat(otherValue).isNotEqualTo(value);
        assertThat(value.hashCode()).isNotEqualTo(otherValue.hashCode());
    }

    @Test
    public void testToString() {
        // Given
        var value = generator.generate();

        // When
        var string = value.toString();

        // Then
        assertThat(string).isNotNull();
    }
}
