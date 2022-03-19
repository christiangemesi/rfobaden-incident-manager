package ch.rfobaden.incidentmanager.backend.controllers.handlers;

import static org.assertj.core.api.Assertions.assertThat;

import ch.rfobaden.incidentmanager.backend.TestConfig;
import ch.rfobaden.incidentmanager.backend.controllers.base.handlers.ApiExceptionHandler;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.errors.UpdateConflictException;
import ch.rfobaden.incidentmanager.backend.errors.ValidationException;
import ch.rfobaden.incidentmanager.backend.utils.validation.Violations;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.DataBinder;
import org.springframework.validation.Validator;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.lang.reflect.Method;
import java.util.List;
import java.util.function.Supplier;
import javax.validation.constraints.NotNull;

@SpringBootTest
@Import(TestConfig.class)
class ApiExceptionHandlerTest {
    @Autowired
    Faker faker;

    @Autowired
    ApiExceptionHandler handler;

    @Autowired
    Validator validator;

    @Test
    void testHandleRemaining() {
        // Given
        var e = new Exception(faker.chuckNorris().fact());

        // When
        var result = handler.handleRemaining(e);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(result.getBody()).isNotNull();
        assertThat(result.getBody().getMessage()).isEqualTo(e.getMessage());
    }

    @Test
    void testHandleRemaining_nestedExceptions() {
        // Given
        var e0 = new Exception(faker.chuckNorris().fact());
        var e1 = new Exception(faker.chuckNorris().fact(), e0);
        var e2 = new Exception(faker.chuckNorris().fact(), e1);

        // When
        var result = handler.handleRemaining(e2);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(result.getBody()).isNotNull();
        assertThat(result.getBody().getMessage()).isEqualTo(
            String.format("%s: %s: %s", e2.getMessage(), e1.getMessage(), e0.getMessage())
        );
    }

    @Test
    void testHandle_ApiException() {
        // Given
        var e = new ApiException(HttpStatus.I_AM_A_TEAPOT, faker.chuckNorris().fact());

        // When
        var result = handler.handle(e);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getStatusCode()).isEqualTo(e.getStatus());
        assertThat(result.getBody()).isNotNull();
        assertThat(result.getBody().getMessage()).isEqualTo(e.getError());
    }

    @Test
    void testHandle_UpdateConflictException() {
        // Given
        var e = new UpdateConflictException(faker.chuckNorris().fact());

        // When
        var result = handler.handle(e);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.PRECONDITION_REQUIRED);
        assertThat(result.getBody()).isNotNull();
        assertThat(result.getBody().getMessage()).isEqualTo(
            "update conflict: the resource has already been modified"
        );
    }

    @Test
    void testHandle_AuthenticationException() {
        // Given
        var e = new AuthenticationException(faker.chuckNorris().fact()) {};

        // When
        var result = handler.handle(e);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(result.getBody()).isNotNull();
        assertThat(result.getBody().getMessage()).isEqualTo(e.getMessage());
    }

    @Test
    void testHandle_MethodArgumentNotValidException() {
        // Given
        MethodArgumentNotValidException e = run(() -> {
            @Validated
            class ValidatedValue {
                @NotNull
                private Object value;

                public Object getValue() {
                    return value;
                }

                public void setValue(Object value) {
                    this.value = value;
                }
            }

            var value = new ValidatedValue();
            var binder = new DataBinder(value);
            binder.setValidator(validator);
            binder.validate();

            Method method;
            try {
                method = ValidatedValue.class.getMethod("setValue", Object.class);
            } catch (NoSuchMethodException ex) {
                throw new IllegalStateException(ex);
            }
            var param = new MethodParameter(method, 0);
            return new MethodArgumentNotValidException(param, binder.getBindingResult());
        });

        // When
        var result = handler.handle(e);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.UNPROCESSABLE_ENTITY);
        assertThat(result.getBody()).isNotNull();

        var fields = result.getBody().getFields();
        assertThat(fields).hasSize(1);
        assertThat(fields.get("value")).isNotNull();

        var fieldValue = fields.get("value");
        assertThat(fieldValue).isInstanceOf(List.class);

        @SuppressWarnings("unchecked")
        var fieldErrors = (List<String>) fieldValue;
        assertThat(fieldErrors).hasSize(1);
        assertThat(fieldErrors.get(0)).isEqualTo("must not be null");
    }



    @Test
    void testHandle_ValidationException() {
        // Given
        var fieldName = "field";
        var error = "is not valid";

        var violations = new Violations();
        violations.add(fieldName, error);
        var e = new ValidationException(violations);

        // When
        var result = handler.handle(e);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.UNPROCESSABLE_ENTITY);
        assertThat(result.getBody()).isNotNull();
        assertThat(result.getBody().getMessage()).isEqualTo("validation failed");
        assertThat(result.getBody().getFields()).isEqualTo(violations.getAll());
    }

    private static <T> T run(Supplier<T> supplier) {
        return supplier.get();
    }
}
