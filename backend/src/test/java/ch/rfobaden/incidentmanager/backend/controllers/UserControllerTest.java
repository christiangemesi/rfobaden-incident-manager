package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.controllers.base.ModelControllerTest;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import ch.rfobaden.incidentmanager.backend.test.generators.UserGenerator;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;

@WebMvcTest(UserController.class)
public class UserControllerTest extends ModelControllerTest<User, UserService> {
    public UserControllerTest() {
        super("/api/v1/users/");
    }
}
