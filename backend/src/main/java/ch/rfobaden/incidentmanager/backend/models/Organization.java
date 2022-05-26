package ch.rfobaden.incidentmanager.backend.models;


import com.fasterxml.jackson.annotation.JsonIgnore;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * {@code Organization} represents an organization to which {@link User users} can belong.
 */
@Entity
@Table(name = "organization")
public final class Organization extends Model.Basic implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * The {@link User users} which belong to the organization.
     */
    @OneToMany(
        mappedBy = "organization",
        cascade = {
            CascadeType.REFRESH,
            CascadeType.DETACH,
            CascadeType.MERGE,
            CascadeType.REMOVE,
        }
    )
    private List<User> users = new ArrayList<>();

    /**
     * The name of the organization.
     */
    @Size(max = 100)
    @NotBlank
    @Column(nullable = false)
    private String name;

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

    /**
     * Allows access to the {@link #getUsers() users}'s id.
     *
     * @return The users' ids.
     */
    public List<Long> getUserIds() {
        List<Long> userIds = new ArrayList<>();
        for (User user : users) {
            userIds.add(user.getId());
        }
        return userIds;
    }

    /**
     * Sets the {@link #getUsers() users} to the users with the ids.
     *
     * @param ids The users' ids.
     */
    public void setUserIds(List<Long> ids) {
        users = new ArrayList<>();
        for (Long id : ids) {
            User user = new User();
            user.setId(id);
            users.add(user);
        }
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

    @Override
    public int hashCode() {
        return Objects.hash(modelHashCode(), name);
    }

}
