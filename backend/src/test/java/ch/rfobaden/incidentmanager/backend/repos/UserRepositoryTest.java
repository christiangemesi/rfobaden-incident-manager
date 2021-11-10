package ch.rfobaden.incidentmanager.backend.repos;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepositoryTest;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Locale;

@DataJpaTest
public class UserRepositoryTest extends ModelRepositoryTest<User, UserRepository> {
    @Test
    public void testFindByEmail() {
        // Given
        var record = repository.save(generator.generatePersisted());

        // When
        var result = repository.findByEmail(record.getEmail()).orElse(null);

        // Then
        assertThat(result).isNotNull();
        assertThat(result).isEqualTo(record);
    }

    @Test
    public void testFindByEmail_ignoreCase() {
        // Given
        var record = repository.save(generator.generatePersisted());

        // When
        var result = repository.findByEmail(record.getEmail().toUpperCase()).orElse(null);

        // Then
        assertThat(result).isNotNull();
        assertThat(result).isEqualTo(record);
    }

    @Test
    public void testFindByEmail_notFound() {
        // Given
        var record = generator.generatePersisted();

        // When
        var result = repository.findByEmail(record.getEmail());

        // Then
        assertThat(result).isEmpty();
    }
}
