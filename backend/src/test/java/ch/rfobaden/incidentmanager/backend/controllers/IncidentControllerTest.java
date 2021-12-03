package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.controllers.base.ModelControllerTest;
import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.services.IncidentService;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;


@WebMvcTest(IncidentController.class)
class IncidentControllerTest extends ModelControllerTest.Basic<Incident, IncidentService> {
    @Override
    protected String getEndpointFor(EmptyPath path) {
        return "/api/v1/incidents/";
    }
    // TODO Test close and reopen, including with invalid id
}