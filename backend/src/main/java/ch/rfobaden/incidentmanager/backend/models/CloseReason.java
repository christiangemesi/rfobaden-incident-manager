package ch.rfobaden.incidentmanager.backend.models;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * {@code CloseReason} describes why an {@link Incident} has been closed.
 * Whenever an incident is closed, a new close reason has to be stated.
 * <p>
 *    When a close reason is created, and it's incident has already been closed once,
 *    the old close reason is linked to the new one.
 *    This creates a chain of close reasons, which tracks the close history of a single incident.
 * </p>
 */
@Entity
@Table(name = "close_reason")
public class CloseReason implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * The close reason's id, unique to its model.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false)
    private Long id;

    /**
     * The reason why the incident has been closed.
     */
    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    /**
     * The moment in time at which the close reason was created.
     * This also represents the time at which the incident has been closed.
     * This value should not be changed after first saving the close reason.
     */
    @NotNull
    @Column(nullable = false)
    private LocalDateTime createdAt;

    /**
     * Link to the previous close reason, {@code null} if it is
     * the first close reason of its incident.
     */
    @OneToOne(cascade = CascadeType.ALL)
    private CloseReason previous;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String reason) {
        this.message = reason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public CloseReason getPrevious() {
        return previous;
    }

    public void setPrevious(CloseReason previous) {
        this.previous = previous;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        CloseReason closeReason = (CloseReason) o;
        return Objects.equals(id, closeReason.id)
            && Objects.equals(message, closeReason.message)
            && Objects.equals(previous, closeReason.previous)
            && Objects.equals(createdAt, closeReason.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(message, previous, createdAt);
    }

    @Override
    public String toString() {
        return "CloseReason{"
            + "id='" + id + '\''
            + ", reason='" + message + '\''
            + ", closedAt=" + createdAt
            + '}';
    }
}
