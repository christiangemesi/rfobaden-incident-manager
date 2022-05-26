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
 * {@code CloseReason} represents a reason why an {@link Incident} is closed.
 * It can be linked to older close reasons.
 */
@Entity
@Table(name = "close_reason")
public class CloseReason implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * The close reasons id, unique to it's model.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false)
    private Long id;

    /**
     * The reason why the incident is closed.
     */
    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    /**
     * The moment in time at which the close reason was created.
     * This value should not be changed after first saving the close reason.
     */
    @NotNull
    @Column(nullable = false)
    private LocalDateTime createdAt;

    /**
     * Link to the previous close reason, {@code null} if it is
     * the first close reason of the incident.
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
