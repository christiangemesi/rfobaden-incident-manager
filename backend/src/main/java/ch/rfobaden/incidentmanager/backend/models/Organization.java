package ch.rfobaden.incidentmanager.backend.models;


import com.fasterxml.jackson.annotation.JsonIgnore;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Entity
@Table(name = "organization")
public final class Organization extends Model.Basic implements Serializable {
    private static final long serialVersionUID = 1L;

    @OneToMany(mappedBy = "organization")
    private List<User> users = new ArrayList<>();

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
            && Objects.equals(name, that.name)
            && Objects.equals(email, that.email);
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
    public List<User> getUsers() {
        return users;
    }

    @JsonIgnore
    public void setUsers(List<User> users) {
        Objects.requireNonNull(users);
        this.users = users;
    }

    public List<Long> getUserIds() {
        List<Long> userIds = new ArrayList<Long>();
        for(User user : users) {
            userIds.add(user.getId());
        }
        return userIds;
    }

    public void setUserIds(List<Long> ids) {
        users = new ArrayList<>();
        for (Long id : ids) {
            User user = new User();
            user.setId(id);
            users.add(user);
        }
    }



    @Override
    public int hashCode() {
        return Objects.hash(modelHashCode(), name, email);
    }

}
