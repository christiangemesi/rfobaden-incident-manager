package ch.rfobaden.incidentmanager.backend.errors;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/**
 * {@code ApiException} represents an API error which has to be propagated to the client.
 * It contains an HTTP status code and a message displayed to the user.
 * <p>
 *     This exception is very similar to the standard Spring {@link ResponseStatusException},
 *     but is displayed differently in responses. In general, we use this class over the standard.
 * </p>
 */
public final class ApiException extends RuntimeException {
    /**
     * The HTTP status code.
     */
    private final HttpStatus status;

    /**
     * The error message.
     */
    private final String error;

    /**
     * Create a new {@code ApiException}.
     *
     * @param status The HTTP status code.
     * @param error The error message.
     */
    public ApiException(HttpStatus status, String error) {
        super("[" + status + "] " + error);
        this.status = status;
        this.error = error;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getError() {
        return error;
    }
}
