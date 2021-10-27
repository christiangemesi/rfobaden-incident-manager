package ch.rfobaden.incidentmanager.backend.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "incident")
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false)
    private Long id = -1L;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private Long authorId;

    private String description;

    private String closeReason;

    @Column(nullable = false)
    private boolean isClosed;

    @Column(nullable = false)
    private LocalDate createdAt;

    @Column(nullable = false)
    private LocalDate updatedAt;

    private LocalDate closedAt;

    private LocalDate startsAt;

    private LocalDate endsAt;

    public Incident() {
    }

    public Incident(String title, Long authorId) {
        this(-1L, title, authorId);
    }

    public Incident(Long id, String title, Long authorId) {
        this.id = id;
        this.title = title;
        this.authorId = authorId;
        this.isClosed = false;
        this.createdAt = LocalDate.now();
        this.updatedAt = this.createdAt;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public long getAuthorId() {
        return authorId;
    }

    public void setAuthorId(long authorId) {
        this.authorId = authorId;
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

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDate getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDate updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDate getClosedAt() {
        return closedAt;
    }

    public void setClosedAt(LocalDate closedAt) {
        this.closedAt = closedAt;
    }

    public LocalDate getStartsAt() {
        return startsAt;
    }

    public void setStartsAt(LocalDate startsAt) {
        this.startsAt = startsAt;
    }

    public LocalDate getEndsAt() {
        return endsAt;
    }

    public void setEndsAt(LocalDate endsAt) {
        this.endsAt = endsAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Incident incident = (Incident) o;
        return Objects.equals(id, incident.getId())
            && isClosed == incident.isClosed
            && Objects.equals(title, incident.title)
            && Objects.equals(authorId, incident.authorId)
            && Objects.equals(description, incident.description)
            && Objects.equals(closeReason, incident.closeReason)
            && Objects.equals(createdAt, incident.createdAt)
            && Objects.equals(updatedAt, incident.updatedAt)
            && Objects.equals(closedAt, incident.closedAt)
            && Objects.equals(startsAt, incident.startsAt)
            && Objects.equals(endsAt, incident.endsAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
            id, title, authorId, description, closeReason,
            isClosed, createdAt, updatedAt, closedAt, startsAt, endsAt
        );
    }

    @Override
    public String toString() {
        return "Incident{"
            + "id=" + id
            + ", title=" + title
            + ", authorId=" + authorId
            + ", description=" + description
            + ", closeReason=" + closeReason
            + ", isClosed=" + isClosed
            + ", creationDate=" + createdAt
            + ", updateDate=" + updatedAt
            + ", closedDate=" + closedAt
            + ", startDate=" + startsAt
            + ", endDate=" + endsAt
            + '}';
    }
}
