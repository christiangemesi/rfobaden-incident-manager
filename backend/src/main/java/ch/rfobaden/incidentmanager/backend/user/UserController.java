package ch.rfobaden.incidentmanager.backend.user;

import ch.rfobaden.incidentmanager.backend.ApiException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller contains all the API mapping. This is part of the N-Tier pattern.
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

    /**
     * @return HTTP status code 200 OK with the found user, or
     *     HTTP status code 404 Not Found if no user exists with the given userId.
     */
    @GetMapping(value = "{userId}")
    public User getUserById(@PathVariable(value = "userId") Long userId) {
        return userService.getUserById(userId).orElseThrow(() -> (
                new ApiException(HttpStatus.NOT_FOUND, "user not found")
        ));
    }

    @PostMapping
    public User addNewUser(@RequestBody User user) {
        return userService.addNewUser(user);
    }

    /**
     * @throws ApiException HTTP status code 404 Not Found if no user exists with the given userId
     */
    @DeleteMapping(value = "{userId}")
    public void deleteUserById(@PathVariable(value = "userId") Long userId) {
        if (!userService.deleteUserById(userId)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "user not found");
        }
    }
}
