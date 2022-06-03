package ch.rfobaden.incidentmanager.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Objects;

/**
 * {@code Trackable} defines an entity whose progress can be documented and monitored.
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

    /**
     * The entity's priority.
     *
     * @return The priority.
     */
    Priority getPriority();

    /**
     * Sets the entity's priority.
     *
     * @param priority The new priority.
     */
    void setPriority(Priority priority);

    /**
     * The {@link User assignee} responsible for the completion of the entity.
     * Can be {@code null} if there's no user assigned to this entity.
     *
     * @return The assignee.
     */
    @JsonIgnore
    User getAssignee();

    /**
     * Sets the entity's assignee.
     *
     * @param assignee The new assignee.
     */
    @JsonIgnore
    void setAssignee(User assignee);

    /**
     * Allows access to the {@link #getAssignee() assignee}'s id.
     * Is {@code null} if there's currently no assignee.
     *
     * @return The assignee's id.
     */
    @JsonProperty
    default Long getAssigneeId() {
        var assignee = getAssignee();
        if (assignee == null) {
            return null;
        }
        return assignee.getId();
    }

    /**
     * Sets the {@link #getAssignee() assignee}'s id.
     * If there's no assignee, a new user will be created using the specified id.
     * If the id is {@code null}, the assignee will be removed.
     *
     * @param assigneeId The assignee's new id.
     */
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
