package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.controllers.base.ModelControllerTest;
import ch.rfobaden.incidentmanager.backend.models.Organization;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.services.OrganizationService;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

@WebMvcTest(OrganizationController.class)
public class OrganizationControllerTest extends ModelControllerTest.Basic<Organization, OrganizationService> {
    @Override
    protected String getEndpointFor(EmptyPath path) {
        return "/api/v1/organizations/";
    }
}
