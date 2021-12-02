package ch.rfobaden.incidentmanager.backend.controllers;


import ch.rfobaden.incidentmanager.backend.controllers.base.ModelController;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.services.IncidentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "api/v1/incidents")
public class IncidentController extends ModelController.Basic<Incident, IncidentService>{

    @PutMapping("{incidentId}/close")
    @ResponseStatus(HttpStatus.OK)
    public Incident closeIncident(
        @PathVariable("incidentId") Long incidentId,
        @RequestBody String closeMessage
    ) {
        return service.closeIncident(incidentId, closeMessage)
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
}
