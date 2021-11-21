package ch.rfobaden.incidentmanager.backend.models;

import java.time.LocalDateTime;
import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

// TODO check class name
@Entity
public class Completion {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false)
    private Long id = -1L;

    private String reason;

    private LocalDateTime createdAt;

    private boolean isClosed;

    public Completion() {
    }

    public Completion(String closeReason) {
        this.reason = closeReason;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDateTime getClosedAt() {
        return createdAt;
    }

    public void setClosedAt(LocalDateTime closedAt) {
        this.createdAt = closedAt;
    }

    public boolean isClosed() {
        return isClosed;
    }

    public void setClosed(boolean closed) {
        isClosed = closed;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Completion completion = (Completion) o;
        return id.equals(completion.id)
                && reason.equals(completion.reason)
                && createdAt.equals(completion.createdAt)
                && isClosed == completion.isClosed;
    }

    @Override
    public int hashCode() {
        return Objects.hash(reason, createdAt, isClosed);
    }

    @Override
    public String toString() {
        return "Completion{"
                + "reason='" + reason + '\''
                + ", closedAt=" + createdAt
                + ", isClosed=" + isClosed
                + '}';
    }
}
