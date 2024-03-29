package ch.rfobaden.incidentmanager.backend.utils.validation;

import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;
import static org.assertj.core.api.ThrowableAssert.catchThrowable;

import ch.rfobaden.incidentmanager.backend.TestConfig;
import ch.rfobaden.incidentmanager.backend.utils.validation.Violations;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@SpringBootTest
@Import(TestConfig.class)
final class ViolationsTest {
    @Autowired
    Faker faker;

    Violations violations;

    @BeforeEach
    void setupViolations() {
        violations = new Violations();
    }

    @Test
    void testIsEmpty_empty() {
        // Then
        assertThat(violations.isEmpty()).isTrue();
    }

    @Test
    void testIsEmpty_onlyFields() {
        // When
        violations.add("field", "error");

        // Then
        assertThat(violations.isEmpty()).isFalse();
    }

    @Test
    void testIsEmpty_onlyNested() {
        // When
        violations.nested("nested").add("field", "error");

        // Then
        assertThat(violations.isEmpty()).isFalse();
    }

    @Test
    void testIsEmpty_fieldsAndNested() {
        // When
        violations.add("field", "error");
        violations.nested("nested").add("field", "error");

        // Then
        assertThat(violations.isEmpty()).isFalse();
    }

    @Test
    void testAdd() {
        // Given
        var field = "field";
        var error = "error";

        // When
        violations.add("field", "error");

        // Then
        assertThat(violations.getAll()).hasSize(1);
        assertThat(violations.getAll()).containsEntry(field, List.of(error));
    }

    @Test
    void testAdd_multipleToSameField() {
        // Given
        var field = "field";
        var error1 = faker.elderScrolls().quote();
        var error2 = faker.elderScrolls().quote();

        // When
        violations.add(field, error1);
        violations.add(field, error2);

        // Then
        assertThat(violations.getAll()).hasSize(1);
        assertThat(violations.getAll()).containsEntry(field, List.of(
            error1,
            error2
        ));
    }


    @Test
    void testAdd_multipleFields() {
        // Given
        var field1 = "field1";
        var error1 = faker.elderScrolls().quote();

        var field2 = "field2";
        var error2 = faker.elderScrolls().quote();

        // When
        violations.add(field1, error1);
        violations.add(field2, error2);

        // Then
        assertThat(violations.getAll()).hasSize(2);
        assertThat(violations.getAll()).containsEntry(field1, List.of(error1));
        assertThat(violations.getAll()).containsEntry(field2, List.of(error2));
    }

    @Test
    void testAdd_nestedField() {
        // Given
        var field = "nested.field";

        // When
        var result = catchThrowable(() -> violations.add(field, "error"));

        // Then
        assertThat(result)
            .isNotNull()
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("can't add with nested field key '" + field + "'");
    }

    @Test
    void testAdd_isNested() {
        // Given
        var field = "nested";

        // When
        violations.nested(field).add("nestedField", "nestedError");
        var result = catchThrowable(() -> violations.add(field, "error"));

        // Then
        assertThat(result)
            .isNotNull()
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("can't add to nested field '" + field + "'");
    }

    @Test
    void testAdd_emptyFieldName() {
        // Given
        var field = "";

        // When
        var result = catchThrowable(() -> violations.add(field, ":)"));

        // Then
        assertThat(result)
            .isNotNull()
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("field name must not be empty");
    }

    @Test
    void testNested() {
        // Given
        var field = "nested";

        // When
        var result = violations.nested(field);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.isEmpty()).isTrue();

        assertThat(violations.getNested())
            .hasSize(1)
            .containsEntry(field, result);
    }


    @Test
    void testNested_deep() {
        // Given
        var field1 = "nested1";
        var field2 = "nested2";
        var field3 = "nested3";

        // When
        var result = violations.nested(field1, field2, field3);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.isEmpty()).isTrue();

        assertThat(violations.getNested())
            .hasSize(1)
            .containsKey(field1);

        assertThat(violations.getNested().get(field1).getNested())
            .hasSize(1)
            .containsKey(field2);

        assertThat(violations.getNested().get(field1).getNested().get(field2).getNested())
            .hasSize(1)
            .containsEntry(field3, result);
    }

    @Test
    void testNested_emptyFieldName() {
        // Given
        var field = "";

        // When
        var result = catchThrowable(() -> violations.nested(field));

        // Then
        assertThat(result)
            .isNotNull()
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("field name must not be empty");
    }

    @Test
    void testNested_isField() {
        // Given
        var field = "field";

        // When
        violations.add(field, "fieldValue");
        var result = catchThrowable(() -> violations.nested(field));

        // Then
        assertThat(result)
            .isNotNull()
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("can't nest into non-nested field '" + field + "'");
    }

    @Test
    void testNested_nestedField() {
        // Given
        var field = "nested.field";

        // When
        var result = catchThrowable(() -> violations.nested(field));

        // Then
        assertThat(result)
            .isNotNull()
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("can't nest into nested field key '" + field + "'");
    }


    @Test
    void testGetAll() {
        // Given
        var field1 = "field1";
        var field1Error = faker.elderScrolls().quote();
        violations.add(field1, field1Error);

        var field2 = "field2";
        var field2Error1 = faker.elderScrolls().quote();
        var field2Error2 = faker.elderScrolls().quote();
        violations.add(field2, field2Error1);
        violations.add(field2, field2Error2);

        var field3 = "field3";
        var field3Nested = "field3Nested";
        var field3NestedError = faker.elderScrolls().quote();
        violations.nested(field3).add(field3Nested, field3NestedError);

        // When
        var result = violations.getAll();

        // Then
        assertThat(result).isNotNull();
        assertThat(new HashMap<>(result))
            .hasSize(3)
            .containsEntry(field1, List.of(field1Error))
            .containsEntry(field2, List.of(field2Error1, field2Error2))
            .containsKey(field3);

        assertThat(result.get(field3))
            .isInstanceOf(Map.class);

        @SuppressWarnings("unchecked")
        var field3Value = (Map<String, Object>) result.get(field3);
        assertThat(field3Value)
            .hasSize(1)
            .containsEntry(field3Nested, List.of(field3NestedError));

    }
}
