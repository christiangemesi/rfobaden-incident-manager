package ch.rfobaden.incidentmanager.backend.controllers.handlers;

import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.errors.UpdateConflictException;
import org.springframework.http.HttpStatus;
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

    @ExceptionHandler(UpdateConflictException.class)
    public ResponseEntity<ApiErrorResponse> handleApiError(UpdateConflictException e) {
        var res = new ApiErrorResponse("update conflict: the resource has already been modified");
        return new ResponseEntity<>(res, HttpStatus.PRECONDITION_REQUIRED);
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
