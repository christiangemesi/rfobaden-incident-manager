package ch.rfobaden.incidentmanager.backend.services.encryption;

public interface EncryptionService {
    String encrypt(String plainPassword);

    boolean matches(String plainPassword, String encryptedPassword);
}
