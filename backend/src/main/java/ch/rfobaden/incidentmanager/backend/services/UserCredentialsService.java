package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.UserCredentials;
import ch.rfobaden.incidentmanager.backend.repos.UserCredentialsRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserCredentialsService
    extends ModelRepositoryService<UserCredentials, UserCredentialsRepository> {

    @Autowired
    public UserCredentialsService(UserCredentialsRepository repository) {
        super(repository);
    }

    @Override
    public UserCredentials create(UserCredentials record) {
        if (record.getId() == null) {
            throw new IllegalStateException("id must be identical to an existing users id");
        }
        record.setLastPasswordChangeAt(LocalDateTime.now());
        return super.create(record);
    }
}
