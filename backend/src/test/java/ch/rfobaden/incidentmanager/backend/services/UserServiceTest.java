package ch.rfobaden.incidentmanager.backend.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.repos.UserRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryServiceTest;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.Optional;

@SpringBootTest
public class UserServiceTest
    extends ModelRepositoryServiceTest.Basic<User, UserService, UserRepository> {
    @Autowired
    protected Faker faker;

    @Test
    protected void testFindByEmail() {
        // Given
        var record = generator.generate();
        Mockito.when(repository.findByEmail(record.getEmail()))
            .thenReturn(Optional.of(record));

        // When
        var result = service.findByEmail(record.getEmail()).orElse(null);

        // Then
        assertThat(result)
            .isNotNull()
            .isEqualTo(record);
        verify(repository, times(1)).findByEmail(record.getEmail());
    }

    @Test
    protected void testFindByEmail_notFound() {
        // Given
        var record = generator.generate();
        Mockito.when(repository.findByEmail(record.getEmail()))
            .thenReturn(Optional.empty());

        // When
        var result = service.findByEmail(record.getEmail()).orElse(null);

        // Then
        assertThat(result).isNull();
        verify(repository, times(1)).findByEmail(record.getEmail());
    }

    @Test
    public void testCreate_credentials() {
        // Given
        var newUser = generator.generateNew();
        Mockito.when(repository.save(newUser)).thenAnswer((i) -> {
            var user = generator.copy(newUser);
            user.setId(generator.generateId());
            user.getCredentials().setId(generator.generateId());
            user.getCredentials().setUser(user);
            return user;
        });

        // When
        var result = service.create(newUser.toPath(), newUser);

        // Then
        assertThat(result).isNotNull();

        var credentials = result.getCredentials();
        assertThat(result.getCredentials()).isNotNull();

        assertThat(credentials.getEncryptedPassword()).isNotBlank();
        assertThat(credentials.getUser()).isEqualTo(result);
        assertThat(credentials.getLastPasswordChangeAt()).isNotNull();
        assertThat(credentials.getCreatedAt()).isNotNull();
        assertThat(credentials.getUpdatedAt())
            .isNotNull()
            .isEqualTo(credentials.getCreatedAt());
        assertThat(credentials.getLastPasswordChangeAt())
            .isNotNull()
            .isEqualTo(credentials.getCreatedAt());

        verify(repository, times(1)).save(newUser);
    }

    @Test
    public void testCreate_presetCredentials() {
        // Given
        var newUser = generator.generateNew();
        newUser.setCredentials(generator.generate().getCredentials());
        newUser.getCredentials().setUser(newUser);

        // When
        var result = catchThrowable(() -> service.create(newUser.toPath(), newUser));

        // Then
        assertThat(result)
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("credentials will be overwritten and must be null");

        verify(repository, never()).save(newUser);
    }

    @Test
    public void testUpdatePassword() {
        // Given
        var user = generator.generate();
        var newPassword = faker.internet().password();
        Mockito.when(repository.findById(user.getId()))
            .thenReturn(Optional.of(user));
        Mockito.when(repository.save(user))
            .thenReturn(user);
        var startedAt = LocalDateTime.now();

        // When
        var result = service.updatePassword(user.getId(), newPassword).orElse(null);

        // Then
        assertThat(result)
            .isNotNull()
            .isEqualTo(user);

        var credentials = result.getCredentials();
        assertThat(credentials.getUpdatedAt()).isAfter(startedAt);
        assertThat(credentials.getLastPasswordChangeAt()).isEqualTo(credentials.getUpdatedAt());
        verify(repository, times(1)).save(user);
    }

    @Test
    public void testUpdatePassword_unknownUser() {
        // Given
        var user = generator.generate();
        var newPassword = faker.internet().password();
        Mockito.when(repository.findById(user.getId()))
            .thenReturn(Optional.empty());

        // When
        var result = service.updatePassword(user.getId(), newPassword);

        // Then
        assertThat(result).isEmpty();
    }

    @Test
    public void testUpdatePassword_nullPassword() {
        // Given
        var user = generator.generate();

        // When
        var result = catchThrowable(() -> service.updatePassword(user.getId(), null));

        // Then
        assertThat(result)
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("password must not be empty");
    }

    @Test
    public void testUpdatePassword_emptyPassword() {
        // Given
        var user = generator.generate();

        // When
        var result = catchThrowable(() -> service.updatePassword(user.getId(), ""));

        // Then
        assertThat(result)
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("password must not be empty");
    }
}
