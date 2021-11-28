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
    protected abstract T generate();

    @Test
    public void testEquals_self() {
        // Given
        var value = generate();

        // When
        var result = value.equals(value);

        // Then
        assertThat(result).isTrue();
    }

    @Test
    public void testEquals_null() {
        // Given
        var value = generate();

        // Then
        assertThat(value).isNotEqualTo(null);
    }

    @Test
    public void testEquals_differentType() {
        // Given
        var value = generate();

        // Then
        assertThat(value).isNotEqualTo(new Object());
    }

    @Test
    public void testEquals_nonEqual() {
        // Given
        var value = generate();
        var otherValue = generate();
        
        // Skip this test if the class is a singleton.
        if (value == otherValue) {
            return;
        }

        // Then
        assertThat(value).isNotEqualTo(otherValue);
        assertThat(otherValue).isNotEqualTo(value);
        assertThat(value.hashCode()).isNotEqualTo(otherValue.hashCode());
    }

    @Test
    public void testToString() {
        // Given
        var value = generate();

        // When
        var string = value.toString();

        // Then
        assertThat(string).isNotNull();
    }
}
