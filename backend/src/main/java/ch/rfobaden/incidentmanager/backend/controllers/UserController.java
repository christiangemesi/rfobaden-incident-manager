package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.controllers.base.ModelController;
import ch.rfobaden.incidentmanager.backend.controllers.helpers.JwtHelper;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping(path = "api/v1/users")
public class UserController extends ModelController<User, UserService> {
    private final JwtHelper jwtHelper;

    public UserController(UserService service, JwtHelper jwtHelper) {
        super(service);
        this.jwtHelper = jwtHelper;
    }

    @PutMapping("/{id}/password")
    @ResponseStatus(HttpStatus.OK)
    public SessionController.SessionData updatePassword(
        @PathVariable("id") Long id,
        @RequestBody PasswordData data
    ) {
        var user = service.updatePassword(id, data.password).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "user not found")
        ));

        // Create a new session token to send back to the client.
        // Sessions of other clients will be invalid from here on out.
        var token = jwtHelper.encodeUser(user);

        return new SessionController.SessionData(token, user);
    }

    public static final class PasswordData {
        private String password;

        public PasswordData() {}

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
