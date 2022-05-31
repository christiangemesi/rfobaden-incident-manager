package ch.rfobaden.incidentmanager.backend.controllers.base.handlers;

import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.errors.MailException;
import ch.rfobaden.incidentmanager.backend.errors.UpdateConflictException;
import ch.rfobaden.incidentmanager.backend.errors.ValidationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
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

/**
 * {@code ApiExceptionHandler} reacts to exceptions thrown in controller components,
 * and returns them to the client in a predefined format.
 */
@ControllerAdvice
public class ApiExceptionHandler {
    private final Logger log = LoggerFactory.getLogger(getClass());

    /**
     * Handles {@link ApiException} instances.
     *
     * @param e The exception to display.
     * @return A {@link ErrorResponse} with the status code specified in the exception.
     */
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErrorResponse> handle(ApiException e) {
        var res = new ErrorResponse(e.getError());
        return new ResponseEntity<>(res, e.getStatus());
    }

    /**
     * Handles {@link UpdateConflictException} instances.
     *
     * @param e The exception to display.
     * @return A {@link ErrorResponse} with
     *      the status code {@link HttpStatus#PRECONDITION_REQUIRED}.
     */
    @ExceptionHandler(UpdateConflictException.class)
    public ResponseEntity<ErrorResponse> handle(UpdateConflictException e) {
        var res = new ErrorResponse("update conflict: the resource has already been modified");
        return new ResponseEntity<>(res, HttpStatus.PRECONDITION_REQUIRED);
    }

    /**
     * Handles {@link MailException} instances.
     *
     * @param e The exception to display.
     * @return A {@link ErrorResponse} with
     *      the status code {@link HttpStatus#INTERNAL_SERVER_ERROR}.
     */
    @ExceptionHandler(MailException.class)
    public ResponseEntity<ErrorResponse> handle(MailException e) {
        var res = new ErrorResponse("failed to send email: " + e.getMessage());
        return new ResponseEntity<>(res, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Handles {@link AuthenticationException} instances.
     *
     * @param e The exception to display.
     * @return A {@link ErrorResponse} with
     *      the status code {@link HttpStatus#UNAUTHORIZED}.
     */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handle(AuthenticationException e) {
        var res = new ErrorResponse(e.getMessage());
        return new ResponseEntity<>(res, HttpStatus.UNAUTHORIZED);
    }

    /**
     * Handles {@link AccessDeniedException} instances.
     *
     * @param e The exception to display.
     * @return A {@link FieldErrorsResponse} with
     *      the status code {@link HttpStatus#FORBIDDEN}.
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handle(AccessDeniedException e) {
        var res = new ErrorResponse(e.getMessage());
        return new ResponseEntity<>(res, HttpStatus.FORBIDDEN);
    }

    /**
     * Handles {@link MethodArgumentNotValidException} instances.
     * They are caused mostly by sending invalid parameters to an API endpoint.
     *
     * @param e The exception to display.
     * @return A {@link FieldErrorsResponse} with
     *      the status code {@link HttpStatus#UNPROCESSABLE_ENTITY}.
     */
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

    /**
     * Handles {@link ValidationException} instances.
     *
     * @param e The exception to display.
     * @return A {@link FieldErrorsResponse} with
     *      the status code {@link HttpStatus#UNPROCESSABLE_ENTITY}.
     */
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<FieldErrorsResponse> handle(ValidationException e) {
        return new ResponseEntity<>(
            new FieldErrorsResponse(e.getViolations().getAll()),
            HttpStatus.UNPROCESSABLE_ENTITY
        );
    }

    /**
     * Handles any non-specialized exceptions.
     *
     * @param e The exception to display.
     * @return An {@link ErrorResponse} with
     *      the status code {@link HttpStatus#INTERNAL_SERVER_ERROR}.
     */
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

    /**
     * {@code ErrorResponse} displays an error message to the client.
     */
    public static class ErrorResponse {
        /**
         * The error message to display.
         */
        private final String message;

        /**
         * Create a new {@code ErrorResponse}.
         *
         * @param message The error message.
         */
        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }

    /**
     * {@code FieldErrorsResponse} displays a mapping of field names
     * to error messages to the client.
     * This is mainly caused by failed validations.
     */
    public static class FieldErrorsResponse extends ErrorResponse {
        /**
         * The field to error mapping.
         */
        private final Map<String, Object> fields;

        /**
         * Create a new {@code FieldErrorsResponse}.
         *
         * @param fields The field to error mapping.
         */
        public FieldErrorsResponse(Map<String, Object> fields) {
            super("validation failed");
            this.fields = fields;
        }

        public Map<String, Object> getFields() {
            return fields;
        }
    }
}
