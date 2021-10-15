package ch.rfobaden.incidentmanager.backend.user;

import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.repos.UserRepository;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testRepositoryIsEmpty() {
        // Given
        // When
        List<User> users = userRepository.findAll();
        // Then
        assertThat(users).isEmpty();
    }

    @Test
    public void testAddUser() {
        // Given
        User newUser = new User("newUser", "newPassword");
        // When
        User savedUser = userRepository.save(newUser);
        // Then
        assertThat(savedUser.getId()).isGreaterThan(0);
        assertThat(savedUser).hasFieldOrPropertyWithValue("username", "newUser");
        assertThat(savedUser).hasFieldOrPropertyWithValue("password", "newPassword");
    }

    @Test
    public void testGetUsers() {
        // Given
        User user1 = new User("user1", "password1");
        User user2 = new User("user2", "password2");
        User user3 = new User("user3", "password3");
        userRepository.save(user1);
        userRepository.save(user2);
        userRepository.save(user3);
        // When
        List<User> users = userRepository.findAll();
        // Then
        assertThat(users).hasSize(3).contains(user1, user2, user3);
    }

    @Disabled
    @Test
    public void testGetUserById() {
        // Given
        userRepository.deleteAll();
        User user1 = new User("user1", "password1");
        User user2 = new User("user2", "password2");
        Long userId = 2L;
        userRepository.save(user1);
        userRepository.save(user2);
        // When
        // TODO Why not workkkkk when run together
        Optional<User> foundUser = userRepository.findById(userId);
        // Then
        assertTrue(foundUser.isPresent());
        assertThat(foundUser.get().getId()).isEqualTo(userId);
        assertThat(foundUser.get()).hasFieldOrPropertyWithValue("username", "user2");
        assertThat(foundUser.get()).hasFieldOrPropertyWithValue("password", "password2");
    }

    @Disabled
    @Test
    public void testDeleteUserById() {
        // Given
        userRepository.deleteAll();
        User user1 = new User("user1", "password1");
        User user2 = new User("user2", "password2");
        User user3 = new User("user3", "password3");
        Long userId = 2L;
        userRepository.save(user1);
        userRepository.save(user2);
        userRepository.save(user3);
        List<User> users = userRepository.findAll();
        assertThat(users.size()).isEqualTo(3);
        // When
        // TODO Why not workkkkk when run together
        userRepository.deleteById(userId);
        users = userRepository.findAll();
        // Then
        assertThat(users).hasSize(2).contains(user1, user3);
    }
}
