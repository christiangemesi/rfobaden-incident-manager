package ch.rfobaden.incidentmanager.backend.controllers;


import ch.rfobaden.incidentmanager.backend.controllers.base.ModelController;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Organization;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.services.OrganizationService;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(path = "api/v1/organizations")
public class OrganizationController
    extends ModelController.Basic<Organization, OrganizationService> {

    private final UserService userService;

    public OrganizationController(UserService userService) {
        this.userService = userService;
    }

    @Override
    protected void loadRelations(EmptyPath path, Organization organization) {
        List<User> users = new ArrayList<>();

        organization.getUsers().forEach(user -> {
            var persistentUser = userService.find(user.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "user not found"));
            users.add(persistentUser);
        });
        organization.setUsers(users);
    }

}
