package ch.rfobaden.incidentmanager.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.validator.constraints.UniqueElements;

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

    @Email(message = "E-Mail muss korrekt formatiert sein")
    @UniqueElements(message = "E-Mail muss eindeutig sein")
    @NotBlank(message = "E-Mail darf nicht leer sein")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Vorname darf nicht leer sein")
    @Column(nullable = false)
    private String firstName;

    @NotBlank(message = "Nachname darf nicht leer sein")
    @Column(nullable = false)
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Valid
    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private UserCredentials credentials;

    @OneToMany(
        mappedBy = "assignee",
        fetch = FetchType.LAZY,
        cascade = CascadeType.DETACH
    )
    private List<Report> assignedReports;

    @OneToMany(
        mappedBy = "assignee",
        fetch = FetchType.LAZY,
        cascade = CascadeType.DETACH
    )
    private List<Task> assignedTasks;

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

    @PreRemove
    private void nullifyAssignments() {
        getAssignedSubtasks().forEach((it) -> it.setAssignee(null));
        getAssignedTasks().forEach((it) -> it.setAssignee(null));
        getAssignedReports().forEach((it) -> it.setAssignee(null));
    }

    public enum Role {
        AGENT,
        ADMIN,
    }
}
