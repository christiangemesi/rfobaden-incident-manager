package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.controllers.base.ModelController;
import ch.rfobaden.incidentmanager.backend.controllers.helpers.SessionHelper;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.services.OrganizationService;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping(path = "api/v1/users")
public class UserController extends ModelController.Basic<User, UserService> {
    private final OrganizationService organizationService;
    private final SessionHelper sessionHelper;

    public UserController(OrganizationService organizationService, SessionHelper sessionHelper) {
        this.organizationService = organizationService;
        this.sessionHelper = sessionHelper;
    }

    @Override
    protected void loadRelations(EmptyPath path, User user) {
        if (user.getOrganization() != null) {
            var organization = organizationService.find(user.getOrganizationId())
                .orElseThrow(() -> new ApiException(
                    HttpStatus.NOT_FOUND, "organization not found"));
            user.setOrganization(organization);
        }
    }

    @Override
    @PreAuthorize("hasRole('ADMIN') or @auth.isCurrentUser(#id)")
    public User update(
        @ModelAttribute EmptyPath path,
        @PathVariable Long id,
        @RequestBody User user
    ) {
        return super.update(path, id, user);
    }

    @PutMapping("/{id}/password")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("@auth.isCurrentUser(#id)")
    public User updatePassword(
        HttpServletResponse response,
        @PathVariable Long id,
        @RequestBody PasswordData data
    ) {
        var user = service.updatePassword(id, data.password).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "user not found")
        ));

        // Create a new session token to send back to the client.
        // Sessions of other clients will be invalid from here on out.
        sessionHelper.addSessionToResponse(response, user);
        return user;
    }

    @PostMapping("/{id}/reset")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN') or @auth.isCurrentUser(#id)")
    public User resetPassword(
        HttpServletResponse response,
        @PathVariable Long id
    ) {
        var user = service.resetPassword(id).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "user not found")
        ));

        // Create a new session token to send back to the client.
        // Sessions of other clients will be invalid from here on out.
        sessionHelper.addSessionToResponse(response, user);
        return user;
    }

    public static final class PasswordData {
        private String password;

        public PasswordData() {
        }

        public PasswordData(String password) {
            this.password = password;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}
