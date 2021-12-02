package ch.rfobaden.incidentmanager.backend.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "incident")
public class Incident extends Model.Basic {

    @NotBlank
    @Column(nullable = false)
    private String title;

    private String description;

    private String closeReason;

    @Column(nullable = false)
    private boolean isClosed;

    @Column(nullable = false)
    private LocalDateTime startsAt;

    private LocalDateTime endsAt;

    private LocalDateTime closedAt;


    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCloseReason() {
        return closeReason;
    }

    public void setCloseReason(String closeReason) {
        this.closeReason = closeReason;
    }

    @JsonProperty("isClosed")
    public boolean isClosed() {
        return isClosed;
    }

    public void setClosed(boolean closed) {
        isClosed = closed;
    }

    public LocalDateTime getStartsAt() {
        return startsAt;
    }

    public void setStartsAt(LocalDateTime startsAt) {
        this.startsAt = startsAt;
    }

    public LocalDateTime getEndsAt() {
        return endsAt;
    }

    public void setEndsAt(LocalDateTime endsAt) {
        this.endsAt = endsAt;
    }

    public LocalDateTime getClosedAt() {
        return closedAt;
    }

    public void setClosedAt(LocalDateTime closedAt) {
        this.closedAt = closedAt;
    }

    @Override
    public String toString() {
        return "Incident{" +
            "id=" + getId() +
            ", createdAt=" + getCreatedAt() +
            ", updatedAt=" + getUpdatedAt() +
            ", title='" + title + '\'' +
            ", description='" + description + '\'' +
            ", closeReason='" + closeReason + '\'' +
            ", isClosed=" + isClosed + '\'' +
            ", startsAt=" + startsAt + '\'' +
            ", endsAt=" + endsAt + '\'' +
            ", closedAt=" + closedAt +
            '}';
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof Incident)) {
            return false;
        }
        var that = (Incident) other;
        return equalsModel(that)
            && Objects.equals(title, that.title)
            && Objects.equals(description, that.description)
            && Objects.equals(closeReason, that.closeReason)
            && Objects.equals(startsAt, that.startsAt)
            && Objects.equals(endsAt, that.endsAt)
            && Objects.equals(closedAt, that.closedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(modelHashCode(), title, description, closeReason, startsAt, endsAt,
            closedAt);
    }
}
