package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.models.UserCredentials;
import ch.rfobaden.incidentmanager.backend.repos.UserRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryService;
import ch.rfobaden.incidentmanager.backend.services.encryption.BcryptEncryptionService;
import ch.rfobaden.incidentmanager.backend.services.encryption.EncryptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Random;

@Service
public class UserService extends ModelRepositoryService<User, UserRepository> {
    private final UserCredentialsService credentialsService;

    private final EncryptionService encryptionService;

    @Autowired
    public UserService(
        UserRepository repository,
        UserCredentialsService credentialsService,
        BcryptEncryptionService encryptionService
    ) {
        super(repository);
        this.credentialsService = credentialsService;
        this.encryptionService = encryptionService;
    }

    public Optional<User> findByEmail(String email) {
        return repository.findByEmail(email);
    }

    @Override
    public User create(User newUser) {
        var user = super.create(newUser);

        var plainPassword = generatePassword(10);
        var credentials = new UserCredentials();
        credentials.setId(user.getId());
        credentials.setEncryptedPassword(encryptionService.encrypt(plainPassword));
        credentialsService.create(credentials);

        // TODO send the generated email to the user by mail.
        // Log the password for now so we can actually now what it is.
        System.out.println("Password for " + user.getEmail() + ": " + plainPassword);


        return user;
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
        System.out.println("password: " + builder.toString());
        return builder.toString();
    }


}
