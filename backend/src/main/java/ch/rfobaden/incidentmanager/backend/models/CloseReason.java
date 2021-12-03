package ch.rfobaden.incidentmanager.backend.models;

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



@Entity
@Table(name = "close_reason")
public class CloseReason {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false)
    private Long id;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @OneToOne(cascade = CascadeType.ALL)
    private CloseReason previous;

    public CloseReason() {
    }

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
