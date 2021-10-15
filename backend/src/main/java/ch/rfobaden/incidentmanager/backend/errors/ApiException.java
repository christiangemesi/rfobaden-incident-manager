package ch.rfobaden.incidentmanager.backend.errors;

import org.springframework.http.HttpStatus;

public final class ApiException extends RuntimeException {
    private final HttpStatus status;

    private final String error;

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
