package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.controllers.base.ModelController;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

@RestController
@RequestMapping(path = "api/v1/users")
public final class UserController extends ModelController<User, UserService> {
    public UserController(UserService service) {
        super(service);
    }


    @PutMapping("{id}/password")
    @ResponseStatus(HttpStatus.OK)
    public User updatePassword(@PathVariable("id") Long id, @RequestBody PasswordData data) {
        return service.updatePassword(record).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "record not found")
        ));
    }

    public static final class PasswordData {
        private final String password;

        public PasswordData(String password) {
            this.password = password;
        }

        public String getPassword() {
            return password;
        }
    }
}
