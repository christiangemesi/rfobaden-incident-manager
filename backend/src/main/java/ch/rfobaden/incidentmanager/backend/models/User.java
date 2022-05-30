package ch.rfobaden.incidentmanager.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.io.Serializable;
import java.util.List;
import java.util.Objects;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.PreRemove;
import javax.persistence.Table;
import javax.validation.Valid;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * {@code User} represents a user of the IncidentManager application.
 */
@Entity
@Table(name = "user")
public final class User extends Model.Basic implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * The organization to which the user belongs.
     * Can be {@code null}.
     */
    @ManyToOne(cascade = {
        CascadeType.PERSIST,
        CascadeType.REFRESH,
        CascadeType.DETACH,
        CascadeType.MERGE
    })
    @JoinColumn
    private Organization organization;

    /**
     * The user's email. Must be unique.
     */
    @Size(max = 100)
    @Email
    @NotBlank
    @Column(nullable = false, unique = true)
    private String email;

    /**
     * The user's first name.
     */
    @Size(max = 100)
    @NotBlank
    @Column(nullable = false)
    private String firstName;

    /**
     * The user's last name.
     */
    @Size(max = 100)
    @NotBlank
    @Column(nullable = false)
    private String lastName;

    /**
     * The user's role.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    /**
     * The user's credentials.
     */
    @Valid
    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private UserCredentials credentials;

    /**
     * The transports assigned to this user.
     */
    @OneToMany(
        mappedBy = "assignee",
        fetch = FetchType.LAZY,
        cascade = CascadeType.DETACH
    )
    private List<Transport> assignedTransports;

    /**
     * The reports assigned to this user.
     */
    @OneToMany(
        mappedBy = "assignee",
        fetch = FetchType.LAZY,
        cascade = CascadeType.DETACH
    )
    private List<Report> assignedReports;

    /**
     * The tasks assigned to this user.
     */
    @OneToMany(
        mappedBy = "assignee",
        fetch = FetchType.LAZY,
        cascade = CascadeType.DETACH
    )
    private List<Task> assignedTasks;

    /**
     * The subtasks assigned to this user.
     */
    @OneToMany(
        mappedBy = "assignee",
        fetch = FetchType.LAZY,
        cascade = CascadeType.DETACH
    )
    private List<Subtask> assignedSubtasks;

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

    @JsonIgnore
    public List<Transport> getAssignedTransports() {
        return assignedTransports;
    }

    @JsonIgnore
    public List<Report> getAssignedReports() {
        return assignedReports;
    }

    @JsonIgnore
    public void setAssignedReports(List<Report> assignedReports) {
        this.assignedReports = assignedReports;
    }

    @JsonIgnore
    public List<Task> getAssignedTasks() {
        return assignedTasks;
    }

    @JsonIgnore
    public void setAssignedTasks(List<Task> assignedTasks) {
        this.assignedTasks = assignedTasks;
    }

    @JsonIgnore
    public List<Subtask> getAssignedSubtasks() {
        return assignedSubtasks;
    }

    @JsonIgnore
    public void setAssignedSubtasks(List<Subtask> assignedSubtasks) {
        this.assignedSubtasks = assignedSubtasks;
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

    /**
     * Remove the user from all entities it was assigned to before it's being deleted.
     */
    @PreRemove
    private void nullifyAssignments() {
        getAssignedSubtasks().forEach((it) -> it.setAssignee(null));
        getAssignedTasks().forEach((it) -> it.setAssignee(null));
        getAssignedReports().forEach((it) -> it.setAssignee(null));
        getAssignedTransports().forEach((it) -> it.setAssignee(null));
    }

    /**
     * {@code Role} defines the roles a user can have.
     * Users have differing levels of permission depending on their role.
     */
    public enum Role {
        /**
         * The {@code AGENT} role gives users a basic permission level.
         * It's the role given to the majority of users.
         */
        AGENT,

        /**
         * The {@code ADMIN} role gives users full access to all features.
         */
        ADMIN,
    }
}
