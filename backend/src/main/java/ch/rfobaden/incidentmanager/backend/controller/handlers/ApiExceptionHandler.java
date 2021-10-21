package ch.rfobaden.incidentmanager.backend.controller.handlers;

import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiErrorResponse> handleApiError(ApiException e) {
        var res = new ApiErrorResponse(e.getError());
        return new ResponseEntity<>(res, e.getStatus());
    }

    public static class ApiErrorResponse {
        private final String message;

        public ApiErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }
}
