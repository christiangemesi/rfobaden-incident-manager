package ch.rfobaden.incidentmanager.backend.repos;

import static org.assertj.core.api.Assertions.assertThat;

import ch.rfobaden.incidentmanager.backend.models.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

@DataJpaTest
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testRepositoryIsEmpty() {
        // When
        List<User> users = userRepository.findAll();

        // Then
        assertThat(users).isEmpty();
    }

    @Test
    public void testAddUser() {
        // Given
        var username = "myTestUsername";
        var password = "myTestPassword";

        // When
        User user = userRepository.save(new User(
            username, password
        ));

        // Then
        assertThat(user.getId()).isGreaterThan(0);
        assertThat(user.getUsername()).isEqualTo(username);
        assertThat(user.getPassword()).isEqualTo(password);
    }

    @Test
    public void testGetUsers() {
        // Given
        User user1 = userRepository.save(new User("user1", "password1"));
        User user2 = userRepository.save(new User("user2", "password2"));
        User user3 = userRepository.save(new User("user3", "password3"));

        // When
        List<User> users = userRepository.findAll();

        // Then
        assertThat(users).hasSize(3).contains(user1, user2, user3);
    }

    @Test
    public void testGetUserById() {
        // Given
        userRepository.save(new User("user1", "password1"));
        User user2 = userRepository.save(new User("user2", "password2"));

        // When
        User user = userRepository.findById(user2.getId()).orElse(null);

        // Then
        assertThat(user).isNotNull();
        assertThat(user).isEqualTo(user2);
    }

    @Test
    public void testDeleteUserById() {
        // Given
        User user1 = userRepository.save(new User("user1", "password1"));
        User user2 = userRepository.save(new User("user2", "password2"));
        User user3 = userRepository.save(new User("user3", "password3"));

        // When
        userRepository.deleteById(user2.getId());

        // Then
        assertThat(userRepository.findAll()).hasSize(2).contains(user1, user3);
    }
}
