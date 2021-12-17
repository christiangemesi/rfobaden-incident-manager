package ch.rfobaden.incidentmanager.backend.controllers;


import ch.rfobaden.incidentmanager.backend.controllers.base.ModelController;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Organization;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.services.OrganizationService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "api/v1/organizations")
public class OrganizationController extends ModelController.Basic<Organization, OrganizationService> {

    private final OrganizationService organizationService;

    public OrganizationController(OrganizationService organizationService) {
        this.organizationService = organizationService;
    }

    //TODO error when oberride is in
    //@Override
    protected void loadRelations(User user, EmptyPath path) {
        if (user.getOrganization() != null) {
            var organization = organizationService.find(user.getOrganization().getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "organization not found"));
            user.setOrganization(organization);
        }
    }

}
