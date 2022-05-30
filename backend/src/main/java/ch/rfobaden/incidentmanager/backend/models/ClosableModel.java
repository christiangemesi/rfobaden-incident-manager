package ch.rfobaden.incidentmanager.backend.models;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * {@code ClosableModel} is the base class for types class representing closable database entities.
 * It provides closable, describable and datetime bounded fields, functionality and utilities for such types.
 */
@MappedSuperclass
public abstract class ClosableModel extends Model
    implements Serializable, Describable, Closeable, DateTimeBounded {
    private static final long serialVersionUID = 1L;

    /**
     * The title of the closable entity.
     */
    @Size(max = 100)
    @NotBlank
    @Column(nullable = false)
    private String title;

    /**
     * A textual description of what the closable entity is about.
     */
    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * The moment in time at which the closable entity will start.
     * This represents the actual time at which the real-life event
     * managed in this entity will start.
     * <p>
     *     This is used to plan a closable entity in advance.
     * </p>
     */
    private LocalDateTime startsAt;

    /**
     * The moment in time at which the closable entity will end.
     * This represents the actual time at which the real-life event
     * managed in this entity will end.
     */
    private LocalDateTime endsAt;

    /**
     * Whether the closable entity is closed.
     * A closed entity counts as completed.
     */
    @NotNull
    @Column(nullable = false)
    private boolean isClosed;

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
    public boolean isClosed() {
        return isClosed;
    }

    @Override
    public void setClosed(boolean closed) {
        isClosed = closed;
    }

    /**
     * Compares the fields of two {@link ClosableModel} instances.
     * <p>
     *     This is a utility method meant to be used in implementations of {@link #equals(Object)}.
     *     It can be called after ensuring that the other object is a {@code ClosableModel},
     *     and before comparing your own column fields.
     * </p>
     *
     * @param other The other model.
     * @return Whether the {@code ClosableModel} fields of {@code this} and {@code other} are equal.
     */
    public boolean equalsClosableModel(Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof ClosableModel)) {
            return false;
        }
        var that = (ClosableModel) other;
        return equalsModel(that)
            && Objects.equals(title, that.title)
            && Objects.equals(description, that.description)
            && Objects.equals(startsAt, that.startsAt)
            && Objects.equals(endsAt, that.endsAt)
            && Objects.equals(isClosed, that.isClosed);
    }

    /**
     * Computes a hashCode over the {@link ClosableModel} fields of this closable entity.
     *
     * @return The computed code.
     */
    public int closableModelHashCode() {
        return Objects.hash(
            modelHashCode(),
            title,
            description,
            startsAt,
            endsAt,
            isClosed
        );
    }
}
