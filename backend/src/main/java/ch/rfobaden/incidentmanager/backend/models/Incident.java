package ch.rfobaden.incidentmanager.backend.models;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
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

    private LocalDateTime startsAt;

    private LocalDateTime endsAt;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "close_reason_id")
    private CloseReason closeReason;

    @Column(nullable = false)
    private boolean isClosed;

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

    public CloseReason getCloseReason() {
        return closeReason;
    }

    public Long getCloseReasonId() {
        if (closeReason == null) {
            return null;
        }
        return closeReason.getId();
    }

    public void setCloseReason(CloseReason closeReason) {
        this.closeReason = closeReason;
    }

    @JsonProperty("isClosed")
    public boolean isClosed() {
        return isClosed;
    }

    public void setClosed(boolean closed) {
        isClosed = closed;
    }

    @Override
    public String toString() {
        return "Incident{" +
            "id=" + getId() +
            ", createdAt=" + getCreatedAt() +
            ", updatedAt=" + getUpdatedAt() +
            ", title='" + title + '\'' +
            ", description='" + description + '\'' +
            ", startsAt=" + startsAt + '\'' +
            ", endsAt=" + endsAt + '\'' +
            ", closeReason=" + closeReason +
            ", isClosed=" + isClosed +
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
        var incident = (Incident) other;
        return equalsModel(incident)
            && Objects.equals(title, incident.title)
            && Objects.equals(description, incident.description)
            && Objects.equals(startsAt, incident.startsAt)
            && Objects.equals(endsAt, incident.endsAt)
            && Objects.equals(closeReason, incident.closeReason)
            && Objects.equals(isClosed, incident.isClosed)
            ;
    }

    @Override
    public int hashCode() {
        return Objects.hash(modelHashCode(), title, description, startsAt, endsAt,
            closeReason, isClosed);
    }
}
