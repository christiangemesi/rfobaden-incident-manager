package ch.rfobaden.incidentmanager.backend.models;

import java.time.LocalDateTime;
import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;

@Entity
public class Completion {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false)
    private Long id;

    private String reason;

    private LocalDateTime createdAt;

    @OneToOne
    private Completion previous;

    public Completion() {
    }

    public Completion(String reason) {
        this.reason = reason;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Completion getPrevious() {
        return previous;
    }

    public void setPrevious(Completion previous) {
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
        Completion completion = (Completion) o;
        return id.equals(completion.id)
                && reason.equals(completion.reason)
                && createdAt.equals(completion.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(reason, createdAt);
    }

    @Override
    public String toString() {
        return "Completion{"
                + "reason='" + reason + '\''
                + ", closedAt=" + createdAt
                + '}';
    }
}
