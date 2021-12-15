package ch.rfobaden.incidentmanager.backend.models;


import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.models.paths.PathConvertible;

import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Entity
@Table(name = "organization")
public final class Organization extends Model.Basic {

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
            && Objects.equals(name, that.name);
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

    @Override
    public int hashCode() {
        return Objects.hash(modelHashCode(), name, email);
    }
}
