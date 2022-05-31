package ch.rfobaden.incidentmanager.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * {@code TrackableModel} is the base class for types class representing
 * trackable database entities.
 * It provides trackable fields, functionality and utilities for such types.
 */
@MappedSuperclass
public abstract class TrackableModel extends Model implements Trackable, Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * The {@link User assignee} responsible for the completion of the trackable entity.
     */
    @ManyToOne
    @JoinColumn
    private User assignee;

    /**
     * The title of the trackable entity.
     */
    @Size(max = 100)
    @NotBlank
    @Column(nullable = false)
    private String title;

    /**
     * A textual description of what the trackable entity is about.
     */
    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * The moment in time at which the trackable entity will start.
     * This represents the actual time at which the real-life event
     * managed in this entity will start.
     * <p>
     *     This is used to plan a trackable entity in advance.
     * </p>
     */
    private LocalDateTime startsAt;

    /**
     * The moment in time at which the trackable entity will end.
     * This represents the actual time at which the real-life event
     * managed in this entity will end.
     */
    private LocalDateTime endsAt;

    /**
     * Whether the trackable entity is closed.
     * A closed trackable entity counts as completed.
     */
    @NotNull
    @Column(nullable = false)
    private boolean isClosed;

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
    public String getTitle() {
        return title;
    }

    @Override
    public void setTitle(String title) {
        this.title = title;
    }

    @Override
    public String getDescription() {
        return description;
    }

    @Override
    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public LocalDateTime getStartsAt() {
        return startsAt;
    }

    @Override
    public void setStartsAt(LocalDateTime startsAt) {
        this.startsAt = startsAt;
    }

    @Override
    public LocalDateTime getEndsAt() {
        return endsAt;
    }

    @Override
    public void setEndsAt(LocalDateTime endsAt) {
        this.endsAt = endsAt;
    }

    @Override
    public Priority getPriority() {
        return priority;
    }

    @Override
    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    @Override
    public boolean isClosed() {
        return isClosed;
    }

    @Override
    public void setClosed(boolean closed) {
        isClosed = closed;
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
     * @return Whether the {@code TrackableModel} fields
     *      of {@code this} and {@code other} are equal.
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
            && Objects.equals(title, that.title)
            && Objects.equals(description, that.description)
            && Objects.equals(startsAt, that.startsAt)
            && Objects.equals(endsAt, that.endsAt)
            && Objects.equals(isClosed, that.isClosed)
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
            title,
            description,
            startsAt,
            endsAt,
            isClosed,
            priority
        );
    }
}
