package ch.rfobaden.incidentmanager.backend.services.encryption;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Service
public class BcryptEncryptionService implements EncryptionService {
    private final PasswordEncoder encoder;

    public BcryptEncryptionService() {
        this.encoder = new BCryptPasswordEncoder();
    }

    @Override
    public String encrypt(String plainPassword) {
        return encoder.encode(plainPassword);
    }

    @Override
    public boolean matches(String plainPassword, String encryptedPassword) {
        return encoder.matches(plainPassword, encryptedPassword);
    }
}
