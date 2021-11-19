package ch.rfobaden.incidentmanager.backend.models;

import java.time.LocalDateTime;
import java.util.Objects;

// TODO check class name
public class Closure {
    private String reason;

    private LocalDateTime closedAt;

    public Closure() {
    }

    public Closure(String closeReason) {
        this.reason = closeReason;
        this.closedAt = LocalDateTime.now();
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDateTime getClosedAt() {
        return closedAt;
    }

    public void setClosedAt(LocalDateTime closedAt) {
        this.closedAt = closedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Closure closure = (Closure) o;
        return reason.equals(closure.reason) && closedAt.equals(closure.closedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(reason, closedAt);
    }

    @Override
    public String toString() {
        return "Closure{"
                + "reason='" + reason + '\''
                + ", closedAt=" + closedAt
                + '}';
    }
}
