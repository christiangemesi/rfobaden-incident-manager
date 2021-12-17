package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.controllers.base.ModelControllerTest;
import ch.rfobaden.incidentmanager.backend.models.Organization;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.services.OrganizationService;
import org.mockito.Mockito;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Optional;

@WebMvcTest(OrganizationController.class)
public class OrganizationControllerTest extends ModelControllerTest.Basic<Organization, OrganizationService> {
    @MockBean
    OrganizationService organizationService;

    //TODO error when in
    //@Override
    protected void mockRelations(User user, EmptyPath path) {
        var organization = user.getOrganization();
        if (organization != null) {
            Mockito.when(organizationService.find(organization.getId()))
                .thenReturn(Optional.of(organization));
        }
    }

    @Override
    protected String getEndpointFor(EmptyPath path) {
        return "/api/v1/organizations/";
    }
}
