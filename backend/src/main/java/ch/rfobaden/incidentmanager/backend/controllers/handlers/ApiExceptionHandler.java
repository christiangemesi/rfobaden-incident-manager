package ch.rfobaden.incidentmanager.backend.controllers.handlers;

import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.errors.UpdateConflictException;
import ch.rfobaden.incidentmanager.backend.errors.ValidationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@ControllerAdvice
public class ApiExceptionHandler {
    private final Logger log = LoggerFactory.getLogger(getClass());

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErrorResponse> handle(ApiException e) {
        var res = new ErrorResponse(e.getError());
        return new ResponseEntity<>(res, e.getStatus());
    }

    @ExceptionHandler(UpdateConflictException.class)
    public ResponseEntity<ErrorResponse> handle(UpdateConflictException e) {
        var res = new ErrorResponse("update conflict: the resource has already been modified");
        return new ResponseEntity<>(res, HttpStatus.PRECONDITION_REQUIRED);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handle(AuthenticationException e) {
        var res = new ErrorResponse(e.getMessage());
        return new ResponseEntity<>(res, HttpStatus.UNAUTHORIZED);
    }

    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<FieldErrorsResponse> handle(MethodArgumentNotValidException e) {
        var errors = new HashMap<String, List<String>>();
        e.getBindingResult().getAllErrors().forEach((error) -> {
            var fieldName = ((FieldError) error).getField();
            var errorMessage = error.getDefaultMessage();
            var fieldErrors = errors.computeIfAbsent(fieldName, (k) -> new ArrayList<>());
            fieldErrors.add(errorMessage);
        });

        @SuppressWarnings("unchecked")
        var errorObjects = (Map<String, Object>) (Map<String, ?>) errors;
        return new ResponseEntity<>(
            new FieldErrorsResponse(errorObjects),
            HttpStatus.UNPROCESSABLE_ENTITY
        );
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<FieldErrorsResponse> handle(ValidationException e) {
        return new ResponseEntity<>(
            new FieldErrorsResponse(e.getViolations().getAll()),
            HttpStatus.UNPROCESSABLE_ENTITY
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleRemaining(Exception e) {
        log.error("Unhandled Error", e);

        var messageBuilder = new StringBuilder();
        Throwable next = e;
        while (next != null) {
            if (messageBuilder.length() != 0) {
                messageBuilder.append(": ");
            }
            messageBuilder.append(next.getMessage());
            next = next.getCause();
        }

        var res = new ErrorResponse(messageBuilder.toString());
        return new ResponseEntity<>(res, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public static class ErrorResponse {
        private final String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        @Override
        public boolean equals(Object other) {
            if (this == other) {
                return true;
            }
            if (!(other instanceof ErrorResponse)) {
                return false;
            }
            var that = (ErrorResponse) other;
            return Objects.equals(message, that.message);
        }

        @Override
        public int hashCode() {
            return Objects.hash(message);
        }
    }

    public static class FieldErrorsResponse extends ErrorResponse {
        private final Map<String, Object> fields;

        public FieldErrorsResponse(Map<String, Object> fields) {
            super("validation failed");
            this.fields = fields;
        }

        public Map<String, Object> getFields() {
            return fields;
        }

        @Override
        public boolean equals(Object other) {
            if (this == other) {
                return true;
            }
            if (!(other instanceof FieldErrorsResponse)) {
                return false;
            }
            var that = (FieldErrorsResponse) other;
            if (!super.equals(that)) {
                return false;
            }
            return Objects.equals(fields, that.fields);
        }

        @Override
        public int hashCode() {
            return Objects.hash(super.hashCode(), fields);
        }
    }
}
