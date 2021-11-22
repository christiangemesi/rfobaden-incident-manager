package ch.rfobaden.incidentmanager.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.validation.annotation.Validated;

import java.util.Objects;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.Valid;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Entity
@Table(name = "user")
public final class User extends Model {
    @Email
    @NotBlank
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String firstName;

    @NotBlank
    @Column(nullable = false)
    private String lastName;

    @Enumerated
    @Column(nullable = false)
    private Role role;

    @OneToOne(
        optional = false,
        fetch = FetchType.LAZY,
        cascade = CascadeType.ALL
    )
    @Valid
    private UserCredentials credentials;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    @JsonIgnore
    public UserCredentials getCredentials() {
        return credentials;
    }

    @JsonIgnore
    public void setCredentials(UserCredentials credentials) {
        this.credentials = credentials;
    }

    @Override
    public String toString() {
        return "User{"
            + "id=" + getId()
            + ", email='" + email + '\''
            +  ", firstName='" + firstName + '\''
            + ", lastName='" + lastName + '\''
            + ", role=" + role
            + ", createdAt=" + getCreatedAt()
            + ", updatedAt=" + getUpdatedAt()
            + '}';
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof User)) {
            return false;
        }
        var that = (User) other;
        return equalsModel(that)
            && Objects.equals(email, that.email)
            && Objects.equals(firstName, that.firstName)
            && Objects.equals(lastName, that.lastName)
            && Objects.equals(role, that.role);
    }

    @Override
    public int hashCode() {
        return Objects.hash(modelHashCode(), email, firstName, lastName, role);
    }

    public enum Role {
        CREATOR,
        ADMIN,
    }
}
