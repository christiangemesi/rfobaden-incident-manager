package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.models.UserCredentials;
import ch.rfobaden.incidentmanager.backend.repos.UserRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryService;
import ch.rfobaden.incidentmanager.backend.services.encryption.BcryptEncryptionService;
import ch.rfobaden.incidentmanager.backend.services.encryption.EncryptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class UserService extends ModelRepositoryService<User, UserRepository> {
    private final EncryptionService encryptionService;

    @Autowired
    public UserService(
        UserRepository repository,
        BcryptEncryptionService encryptionService
    ) {
        super(repository);
        this.encryptionService = encryptionService;
    }

    public Optional<User> findByEmail(String email) {
        return repository.findByEmail(email);
    }

    @Override
    public User create(User newUser) {
        if (newUser.getCredentials() != null) {
            throw new IllegalArgumentException("credentials will be overwritten and must be null");
        }

        var credentials = new UserCredentials();
        var plainPassword = generatePassword(10);
        credentials.setEncryptedPassword(encryptionService.encrypt(plainPassword));
        credentials.setCreatedAt(LocalDateTime.now());
        credentials.setUpdatedAt(credentials.getCreatedAt());
        credentials.setLastPasswordChangeAt(credentials.getCreatedAt());
        credentials.setUser(newUser);
        newUser.setCredentials(credentials);

        var user = super.create(newUser);

        // TODO send the generated email to the user by mail.
        // Log the password for now so we can actually now what it is.
        System.out.println("Password for " + user.getEmail() + ": " + plainPassword);

        return user;
    }

    public Optional<User> updatePassword(User user, String password) {
        if (password == null || password.trim().length() == 0) {
            throw new IllegalArgumentException("password must not be empty");
        }
        var credentials = user.getCredentials();
        credentials.setEncryptedPassword(encryptionService.encrypt(password));
        credentials.setUpdatedAt(LocalDateTime.now());
        credentials.setLastPasswordChangeAt(credentials.getUpdatedAt());
        return Optional.of(repository.save(user));
    }

    private static final String PASSWORD_CHARS =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%&";

    private static String generatePassword(int length) {
        var random = new Random();
        StringBuilder builder = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            var nextChar = PASSWORD_CHARS.charAt(random.nextInt(PASSWORD_CHARS.length()));
            builder.append(nextChar);
        }
        return builder.toString();
    }


}
