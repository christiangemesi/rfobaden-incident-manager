package ch.rfobaden.incidentmanager.backend.test.generators;

import ch.rfobaden.incidentmanager.backend.models.UserCredentials;
import ch.rfobaden.incidentmanager.backend.test.generators.base.ModelGenerator;
import org.springframework.boot.test.context.TestComponent;

import java.time.LocalDateTime;

@TestComponent
public class UserCredentialsGenerator extends ModelGenerator<UserCredentials> {
    @Override
    public UserCredentials generateNew() {
        var credentials = new UserCredentials();
        credentials.setEncryptedPassword(faker.crypto().md5());
        credentials.setLastPasswordChangeAt(LocalDateTime.now().minusDays(2));
        return credentials;
    }
}
