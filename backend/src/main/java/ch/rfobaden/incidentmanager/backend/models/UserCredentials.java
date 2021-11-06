package ch.rfobaden.incidentmanager.backend.models;

import java.time.LocalDateTime;
import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "user_credentials")
public final class UserCredentials extends Model {
    @Column(nullable = false)
    private String encryptedPassword;

    private LocalDateTime lastSignInAt;

    @Column(nullable = false)
    private LocalDateTime lastPasswordChangeAt;

    public String getEncryptedPassword() {
        return encryptedPassword;
    }

    public void setEncryptedPassword(String encryptedPassword) {
        this.encryptedPassword = encryptedPassword;
    }

    public LocalDateTime getLastSignInAt() {
        return lastSignInAt;
    }

    public void setLastSignInAt(LocalDateTime lastSignInAt) {
        this.lastSignInAt = lastSignInAt;
    }

    public LocalDateTime getLastPasswordChangeAt() {
        return lastPasswordChangeAt;
    }

    public void setLastPasswordChangeAt(LocalDateTime lastPasswordChangeAt) {
        this.lastPasswordChangeAt = lastPasswordChangeAt;
    }

    @Override
    public String toString() {
        return "UserCredentials{"
            + "id='" + getId() + '\''
            + ", encryptedPassword='" + encryptedPassword + '\''
            + ", lastSignInAt='" + lastSignInAt + '\''
            + ", lastPasswordChangeAt='" + lastPasswordChangeAt + '\''
            + ", createdAt='" + getCreatedAt() + '\''
            + ", updatedAt='" + getUpdatedAt() + '\''
            + '}';
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof UserCredentials)) {
            return false;
        }
        var that = (UserCredentials) other;
        return equalsModel(that)
            && Objects.equals(lastSignInAt, that.lastSignInAt)
            && Objects.equals(lastPasswordChangeAt, that.lastPasswordChangeAt)
            && Objects.equals(encryptedPassword, that.encryptedPassword);
    }

    @Override
    public int hashCode() {
        return Objects.hash(modelHashCode(), lastSignInAt, lastPasswordChangeAt, encryptedPassword);
    }
}
