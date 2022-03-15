package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.EmailConfig;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.models.UserCredentials;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.repos.UserRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryService;
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

@Service
public class UserService extends ModelRepositoryService.Basic<User, UserRepository> {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final PasswordEncoder passwordEncoder;

    private final EmailConfig emailConfig;

    private final SecureRandom passwordRandom = new SecureRandom();

    @Autowired
    public UserService(PasswordEncoder passwordEncoder, EmailConfig emailConfig) {
        this.passwordEncoder = passwordEncoder;
        this.emailConfig = emailConfig;
    }

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

        emailConfig.sendSimpleMessage(user.getEmail(), "IM-Tool RFOBaden: Benutzer erstellt",
            emailConfig.getPasswordTemplateMessage(user.getEmail(), plainPassword));

        logger.info("Password for {}: {}", user.getEmail(), plainPassword);
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

    private String generatePassword(int length) {
        StringBuilder builder = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            var nextChar = PASSWORD_CHARS.charAt(passwordRandom.nextInt(PASSWORD_CHARS.length()));
            builder.append(nextChar);
        }
        return builder.toString();
    }
}
