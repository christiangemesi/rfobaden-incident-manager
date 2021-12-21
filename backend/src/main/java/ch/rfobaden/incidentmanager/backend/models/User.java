package ch.rfobaden.incidentmanager.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.io.Serializable;
import java.util.Objects;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.Valid;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Entity
@Table(name = "user")
public final class User extends Model.Basic implements Serializable {
    private static final long serialVersionUID = 1L;

    @ManyToOne(cascade = {
        CascadeType.PERSIST,
        CascadeType.REFRESH,
        CascadeType.DETACH,
        CascadeType.MERGE
    })
    @JoinColumn
    private Organization organization;

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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Valid
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "user", cascade = CascadeType.ALL)
    @OnDelete(action = OnDeleteAction.CASCADE)
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
        if (this.credentials != credentials) {
            this.credentials = credentials;
            credentials.setUser(this);
        }
    }
    
    @JsonIgnore
    public Organization getOrganization() {
        return organization;
    }

    @JsonIgnore
    public void setOrganization(Organization organization) {
        this.organization = organization;
    }

    public Long getOrganizationId() {
        if (organization == null) {
            return null;
        }
        return organization.getId();
    }

    public void setOrganizationId(Long id) {
        if (id == null) {
            organization = null;
            return;
        }
        organization = new Organization();
        organization.setId(id);
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
            && Objects.equals(role, that.role)
            && Objects.equals(organization, that.organization);
    }

    @Override
    public int hashCode() {
        return Objects.hash(modelHashCode(), email, firstName, lastName, role, organization);
    }

    public enum Role {
        CREATOR,
        ADMIN,
    }
}
