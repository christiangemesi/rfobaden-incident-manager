package ch.rfobaden.incidentmanager.backend.models;

import java.time.LocalDateTime;
import java.util.Objects;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "completion")
public class Completion {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false)
    private Long id;

    @Column(nullable = false)
    private String reason;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @OneToOne(cascade = CascadeType.ALL)
    private Completion previous;

    @OneToOne(mappedBy = "previous", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Completion next;

    public Completion() {
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
        return Objects.equals(id, completion.id)
                && Objects.equals(reason, completion.reason)
                && Objects.equals(createdAt, completion.createdAt);
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
