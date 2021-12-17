package ch.rfobaden.incidentmanager.backend.models;


import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.models.paths.PathConvertible;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Entity
@Table(name = "organization")
public final class Organization extends Model.Basic {

    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private User user;

    @Email
    @NotBlank
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Override
    public String toString() {
        return "Organization{"
            + "id=" + getId()
            + ", name=" + name
            + ", email=" + email
            + ", createdAt=" + getCreatedAt()
            + ", updatedAt=" + getUpdatedAt()
            + ", user=" + user
            + '}';
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof Organization)) {
            return false;
        }
        var that = (Organization) other;
        return equalsModel(that)
            && Objects.equals(name, that.name)
            && Objects.equals(email, that.email)
            && Objects.equals(user, that.user);
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String organizationName) {
        this.name = organizationName;
    }

    @JsonIgnore
    public User getUser() {
        return user;
    }

    @JsonIgnore
    public void setUser(User user) {
        this.user = user;
    }

    public Long getUserId() {
        if (user == null) {
            return null;
        }
        return user.getId();
    }

    public void setAddressId(Long id) {
        if (id == null) {
            user = null;
            return;
        }
        user = new User();
        user.setId(id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(modelHashCode(), name, email, user);
    }

}
