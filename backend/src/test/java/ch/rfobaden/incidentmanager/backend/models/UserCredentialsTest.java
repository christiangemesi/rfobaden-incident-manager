package ch.rfobaden.incidentmanager.backend.models;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import ch.rfobaden.incidentmanager.backend.models.base.ModelTest;
import ch.rfobaden.incidentmanager.backend.test.generators.UserGenerator;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class UserCredentialsTest extends ModelTest<UserCredentials> {
    @Autowired
    UserGenerator userGenerator;

    @Test
    public void testGetId() {
        // When
        var credentials = generator.generate();
        var user = userGenerator.generate();
        credentials.setUser(user);

        // When
        var userId = credentials.getUserId();

        // Then
        assertThat(userId).isEqualTo(user.getId());
    }
}
