package ch.rfobaden.incidentmanager.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/*
 * Service Layer is responsible for business logic. This is part of the N-Tier pattern
 */
@Service // this is the same as @Component but better for semantic
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    public void addNewUser(User user) {
        userRepository.save(user);
    }
}
