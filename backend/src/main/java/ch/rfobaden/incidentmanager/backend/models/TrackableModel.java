package ch.rfobaden.incidentmanager.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;
import javax.validation.constraints.NotNull;

/**
 * {@code TrackableModel} is the class for types class representing trackable database entities.
 * It provides trackable fields, functionality and utilities for such types.
 */
@MappedSuperclass
public abstract class TrackableModel extends ClosableModel implements Trackable {
    private static final long serialVersionUID = 1L;

    /**
     * The {@link User assignee} responsible for the completion of the trackable entity.
     */
    @ManyToOne
    @JoinColumn
    private User assignee;

    /**
     * The priority of the trackable entity.
     */
    @NotNull
    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false)
    private Priority priority;

    @JsonIgnore
    public User getAssignee() {
        return assignee;
    }

    @Override
    public void setAssignee(User assignee) {
        this.assignee = assignee;
    }

    @Override
    public Priority getPriority() {
        return priority;
    }

    @Override
    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    /**
     * Compares the fields of two {@link TrackableModel} instances.
     * <p>
     *     This is a utility method meant to be used in implementations of {@link #equals(Object)}.
     *     It can be called after ensuring that the other object is a {@code TrackableModel},
     *     and before comparing your own column fields.
     * </p>
     *
     * @param other The other model.
     * @return Whether the {@code TrackableModel} fields of {@code this} and {@code other} are equal.
     */
    public boolean equalsTrackableModel(Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof TrackableModel)) {
            return false;
        }
        var that = (TrackableModel) other;
        return equalsModel(that)
            && Objects.equals(assignee, that.assignee)
            && priority == that.priority;
    }

    /**
     * Computes a hashCode over the {@link TrackableModel} fields of this trackable entity.
     *
     * @return The computed code.
     */
    public int trackableModelHashCode() {
        return Objects.hash(
            modelHashCode(),
            assignee,
            priority
        );
    }
}
