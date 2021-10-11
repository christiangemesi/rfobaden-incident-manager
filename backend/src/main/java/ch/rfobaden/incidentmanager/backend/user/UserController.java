package ch.rfobaden.incidentmanager.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

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

    /**
     * @return HTTP status code 200 OK with the found users, or
     * HTTP status code 204 No Content if there are no users.
     */
    @GetMapping
    public ResponseEntity<List<User>> getUsers() {
        List<User> users = userService.getUsers();
        if (users.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        else
            return new ResponseEntity<>(users, HttpStatus.OK);
    }

    /**
     * @return HTTP status code 200 OK with the found user, or
     * HTTP status code 404 Not Found if no user exists with the given userId, or
     * HTTP status code 500 Internal Server Error if the given userId was null.
     */
    @GetMapping(value = "{userId}")
    public ResponseEntity<User> getUserById(@PathVariable(value = "userId") Long userId) {
        try {
            Optional<User> user = userService.getUserById(userId);
            if (user.isPresent())
                return new ResponseEntity<>(user.get(), HttpStatus.OK);
            else
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * @return HTTP status code 201 Created with the created user, or
     * HTTP status code 400 Bad Request if the user given was null.
     */
    @PostMapping
    public ResponseEntity<User> addNewUser(@RequestBody User user) {
        try {
            User created = userService.addNewUser(user);
            System.out.println("created: " + created);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * @return HTTP status code 204 No Content if the user was deleted, or
     * HTTP status code 404 Not Found if no user exists with the given userId, or
     * HTTP status code 500 Internal Server Error if the given userId was null.
     */
    @DeleteMapping(value = "{userId}")
    public ResponseEntity<HttpStatus> deleteUserById(@PathVariable(value = "userId") Long userId) {
        try {
            if (userService.deleteUserById(userId))
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            else
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
