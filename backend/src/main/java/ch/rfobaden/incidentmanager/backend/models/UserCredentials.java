package ch.rfobaden.incidentmanager.backend.models;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * {@code UserCredentials} contains the login information of a specific {@link User}.
 */
@Entity
@Table(name = "user_credentials")
public final class UserCredentials extends Model implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * The user to which the credentials belong.
     */
    @NotNull
    @OneToOne(optional = false, fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private User user;

    /**
     * The password of the user.
     */
    @NotBlank
    @Column(nullable = false)
    private String encryptedPassword;

    /**
     * The point in time at which the {@link #encryptedPassword password} has last been changed.
     */
    @NotNull
    @Column(nullable = false)
    private LocalDateTime lastPasswordChangeAt;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        if (this.user != user) {
            this.user = user;
            user.setCredentials(this);
        }
    }

    public Long getUserId() {
        if (user == null) {
            return null;
        }
        return user.getId();
    }

    public String getEncryptedPassword() {
        return encryptedPassword;
    }

    public void setEncryptedPassword(String encryptedPassword) {
        this.encryptedPassword = encryptedPassword;
    }

    public LocalDateTime getLastPasswordChangeAt() {
        return lastPasswordChangeAt;
    }

    public void setLastPasswordChangeAt(LocalDateTime lastPasswordChangeAt) {
        this.lastPasswordChangeAt = lastPasswordChangeAt;
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
            && Objects.equals(lastPasswordChangeAt, that.lastPasswordChangeAt)
            && Objects.equals(encryptedPassword, that.encryptedPassword)
            && Objects.equals(getUserId(), that.getUserId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(
            modelHashCode(), lastPasswordChangeAt, encryptedPassword, getUserId()
        );
    }
}
