package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.models.UserCredentials;
import ch.rfobaden.incidentmanager.backend.repos.UserRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryService;
import ch.rfobaden.incidentmanager.backend.utils.validation.Violations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;
import java.util.Random;

@Service
public class UserService extends ModelRepositoryService<User, UserRepository> {
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(
        UserRepository repository,
        PasswordEncoder passwordEncoder
    ) {
        super(repository);
        this.passwordEncoder = passwordEncoder;
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
        credentials.setEncryptedPassword(passwordEncoder.encode(plainPassword));
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

    public Optional<User> updatePassword(Long id, String password) {
        if (password == null || password.trim().length() == 0) {
            throw new IllegalArgumentException("password must not be empty");
        }
        var user = find(id).orElse(null);
        if (user == null) {
            return Optional.empty();
        }
        var credentials = user.getCredentials();
        credentials.setEncryptedPassword(passwordEncoder.encode(password));
        credentials.setUpdatedAt(LocalDateTime.now());
        credentials.setLastPasswordChangeAt(credentials.getUpdatedAt());
        validate(user);
        return Optional.of(repository.save(user));
    }

    @Override
    protected void validate(User user, Violations violations) {
        // Validate that the email is unique.
        // This will also be handled by the database, but it then causes an exception
        // from which we can't form a message usable by the frontend - the main cause for
        // this is the SQL exception not stating which field caused the error.
        if (isPersisted(user)) {
            var emailCount = repository.countByEmail(user.getEmail());
            if (emailCount != 0) {
                violations.add("email", "must be unique");
            }
        } else {
            var persistedRecord = repository.findByEmail(user.getEmail()).orElse(null);
            if (persistedRecord != null
                && !Objects.equals(persistedRecord.getId(), user.getId())) {
                violations.add("email", "must be unique");
            }
        }
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
