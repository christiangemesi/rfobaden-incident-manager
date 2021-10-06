package ch.rfobaden.incidentmanager.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/*
    Controller contains all the API mapping for User
 */
@RestController
@RequestMapping(path = "api/v1/users")
public class UserController {

    private final UserService userService;

    // This is Dependency injection
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getUsers() {
        return userService.getUsers();
    }
}
