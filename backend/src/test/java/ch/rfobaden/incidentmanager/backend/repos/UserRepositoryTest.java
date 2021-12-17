package ch.rfobaden.incidentmanager.backend.repos;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import ch.rfobaden.incidentmanager.backend.models.Organization;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepositoryTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
public class UserRepositoryTest extends ModelRepositoryTest.Basic<User, UserRepository> {
    @Autowired
    UserRepository userRepository;

    //TODO red when in
    //@Override
    protected void saveRelations(Organization organization) {
        var user = organization.getUser();
        if (user != null) {
            organization.setUser(userRepository.save(user));
        }
    }

    @Test
    public void testFindByEmail() {
        // Given
        var record = repository.save(generator.generate());

        // When
        var result = repository.findByEmail(record.getEmail()).orElse(null);

        // Then
        assertThat(result).isNotNull();
        assertThat(result).isEqualTo(record);
    }

    @Test
    public void testFindByEmail_ignoreCase() {
        // Given
        var record = repository.save(generator.generate());

        // When
        var result = repository.findByEmail(record.getEmail().toUpperCase()).orElse(null);

        // Then
        assertThat(result).isNotNull();
        assertThat(result).isEqualTo(record);
    }

    @Test
    public void testFindByEmail_notFound() {
        // Given
        var record = generator.generate();

        // When
        var result = repository.findByEmail(record.getEmail());

        // Then
        assertThat(result).isEmpty();
    }
}
