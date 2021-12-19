package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.controllers.base.ModelControllerTest;
import ch.rfobaden.incidentmanager.backend.models.Organization;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.services.OrganizationService;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import org.mockito.Mockito;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.TestPropertySource;

import java.util.Optional;

@TestPropertySource(properties = "app.mock-user-service=false")
@WebMvcTest(OrganizationController.class)
public class OrganizationControllerTest extends ModelControllerTest.Basic<Organization, OrganizationService> {

    @MockBean
    UserService userService;

    @Override
    protected void mockRelations(EmptyPath path, Organization organization) {
        var users = organization.getUsers();
        for (User user : users) {
            Mockito.when(userService.find(user.getId()))
                .thenReturn(Optional.of(user));
        }
    }

    @Override
    protected String getEndpointFor(EmptyPath path) {
        return "/api/v1/organizations/";
    }
}
