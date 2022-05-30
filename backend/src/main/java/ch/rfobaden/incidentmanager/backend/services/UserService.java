package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.models.UserCredentials;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.repos.UserRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryService;
import ch.rfobaden.incidentmanager.backend.services.base.ModelService;
import ch.rfobaden.incidentmanager.backend.services.notifications.NotificationService;
import ch.rfobaden.incidentmanager.backend.utils.validation.Violations;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;

/**
 * {@code UserService} is a {@link ModelService} for {@link User users}.
 */
@Service
public class UserService extends ModelRepositoryService.Basic<User, UserRepository> {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final PasswordEncoder passwordEncoder;

    private final NotificationService notificationService;

    private final SecureRandom passwordRandom = new SecureRandom();

    @Autowired
    public UserService(PasswordEncoder passwordEncoder, NotificationService notificationService) {
        this.passwordEncoder = passwordEncoder;
        this.notificationService = notificationService;
    }

    /**
     * Attempts to load a user that has a specific email.
     *
     * @param email The email to match.
     * @return An {@link Optional} containing the user,
     *         or {@link Optional#empty()}, if no matching user exists.
     */
    public Optional<User> findByEmail(String email) {
        return repository.findByEmail(email);
    }

    @Override
    public User create(EmptyPath path, User newUser) {
        if (newUser.getCredentials() != null) {
            throw new IllegalArgumentException("credentials will be overwritten and must be null");
        }

        var credentials = new UserCredentials();
        var plainPassword = generatePassword(10);
        credentials.setEncryptedPassword(passwordEncoder.encode(plainPassword));
        credentials.setCreatedAt(LocalDateTime.now());
        credentials.setUpdatedAt(credentials.getCreatedAt());
        credentials.setLastPasswordChangeAt(credentials.getCreatedAt());
        newUser.setCredentials(credentials);
        var user = super.create(path, newUser);

        notificationService.notifyNewUser(user, plainPassword);
        logger.debug("Password for new user {}: {}", user.getEmail(), plainPassword);

        return user;
    }

    /**
     * Updates a user's password.
     *
     * @param id The id of the user whose password gets updated.
     * @param password The new password.
     * @return An {@link Optional} containing the updated user,
     *         or {@link Optional#empty()}, if no matching user exists.
     */
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

    /**
     * Sets a user's password to a new randomly generated value.
     * The user is notified about the change and the new password is sent to him via email.
     *
     * @param id The id of the user whose password gets reset.
     * @return An {@link Optional} containing the updated user,
     *         or {@link Optional#empty()}, if no matching user exists.
     */
    public Optional<User> resetPassword(Long id) {
        User user = find(id).orElse(null);
        if (user == null) {
            return Optional.empty();
        }
        String plainPassword = generatePassword(10);
        UserCredentials credentials = user.getCredentials();
        credentials.setEncryptedPassword(passwordEncoder.encode(plainPassword));
        credentials.setUpdatedAt(LocalDateTime.now());
        credentials.setLastPasswordChangeAt(credentials.getUpdatedAt());
        validate(user);
        User savedUser = repository.save(user);
        notificationService.notifyPasswordReset(savedUser, plainPassword);
        logger.debug("Password for user {} was reset to {}", user.getEmail(), plainPassword);

        return Optional.of(savedUser);
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

    /**
     * The characters used for randomly generated passwords.
     */
    private static final String PASSWORD_CHARS =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%&";

    /**
     * Generates a random password.
     *
     * @param length The length of the password.
     * @return The generated password.
     */
    private String generatePassword(int length) {
        StringBuilder builder = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            var nextChar = PASSWORD_CHARS.charAt(passwordRandom.nextInt(PASSWORD_CHARS.length()));
            builder.append(nextChar);
        }
        return builder.toString();
    }
}
