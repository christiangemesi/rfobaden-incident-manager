package ch.rfobaden.incidentmanager.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping(value = "{userId}")
    public User getUserById(@PathVariable(value="userId") Long userId) {
        System.out.println(userId);
        return userService.getUserById(userId);
    }

    @PostMapping
    public User addNewUser(@RequestBody User user) {
        return userService.addNewUser(user);
    }
}
