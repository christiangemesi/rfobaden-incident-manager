package ch.rfobaden.incidentmanager.backend.controllers;


import ch.rfobaden.incidentmanager.backend.controllers.base.ModelController;
import ch.rfobaden.incidentmanager.backend.controllers.base.annotations.RequireAdmin;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.services.IncidentService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "api/v1/incidents")
public class IncidentController extends ModelController.Basic<Incident, IncidentService> {
    @PutMapping("{incidentId}/close")
    @ResponseStatus(HttpStatus.OK)
    public Incident closeIncident(
        @PathVariable("incidentId") Long incidentId,
        @RequestBody CloseMessageData closeMessageData
    ) {
        return service.closeIncident(incidentId, closeMessageData.getMessage())
            .orElseThrow(() -> (
                new ApiException(HttpStatus.NOT_FOUND, "incident not found")
            ));
    }

    @PutMapping("{incidentId}/reopen")
    @ResponseStatus(HttpStatus.OK)
    public Incident reopenIncident(@PathVariable("incidentId") Long incidentId) {
        return service.reopenIncident(incidentId)
            .orElseThrow(() -> (
                new ApiException(HttpStatus.NOT_FOUND, "incident not found")
            ));
    }

    public static final class CloseMessageData {
        private String message;

        public CloseMessageData() {
        }

        public CloseMessageData(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
