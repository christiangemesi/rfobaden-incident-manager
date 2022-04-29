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

@Entity
@Table(name = "organization")
public final class Organization extends Model.Basic implements Serializable {
    private static final long serialVersionUID = 1L;

    @OneToMany(
        mappedBy = "organization",
        cascade = {
            CascadeType.REFRESH,
            CascadeType.DETACH,
            CascadeType.MERGE
        }
    )
    private List<User> users = new ArrayList<>();

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

    public List<Long> getUserIds() {
        List<Long> userIds = new ArrayList<>();
        for (User user : users) {
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
