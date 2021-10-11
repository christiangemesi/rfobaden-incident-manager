package ch.rfobaden.incidentmanager.backend.user;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.junit4.SpringRunner;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    // TODO get help with "Failed to load ApplicationContext" Exception
    @Test
    public void testAddUser() {
        //Given
        User newUser = new User("newUser", "newPassword");
        //When
        User savedUser = userRepository.save(newUser);
        //Then
        assertThat(savedUser.getId()).isGreaterThan(0);
    }
}
