package ch.rfobaden.incidentmanager.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.lang.Nullable;

import java.util.Objects;

/**
 * {@code Trackable} defines a model whose progress can be documented and monitored.
 */
public interface Trackable extends Describable, DateTimeBounded, Closeable {
    /**
     * The path at which the entity can be found on the frontend.
     * Must start, but not end with a slash ('/').
     *
     * @return The frontend path for this entity.
     */
    String getLink();

    /**
     * The full title of the entity.
     * This is the {@link #getTitle() title} of the entity,
     * prefixed with the full title of all parent entities.
     * Titles are joined with slashes ('/').
     *
     * @return The entities full title.
     */
    String getFullTitle();

    Priority getPriority();

    void setPriority(Priority priority);

    @JsonIgnore
    User getAssignee();

    @JsonIgnore
    void setAssignee(User assignee);

    @JsonProperty
    default Long getAssigneeId() {
        var assignee = getAssignee();
        if (assignee == null) {
            return null;
        }
        return assignee.getId();
    }

    @JsonProperty
    default void setAssigneeId(Long assigneeId) {
        if (assigneeId == null) {
            setAssignee(null);
            return;
        }
        var assignee = getAssignee();
        if (assignee != null && Objects.equals(assignee.getId(), assigneeId)) {
            return;
        }
        var user = new User();
        user.setId(assigneeId);
        setAssignee(user);
    }
}
