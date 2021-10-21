package ch.rfobaden.incidentmanager.backend.models;

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
    private long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private Long authorId;

    private String description;

    private String closeReason;

    @Column(nullable = false)
    private boolean isClosed;

    //todo should Date be in the variable name?
    @Column(nullable = false)
    private LocalDate createdAt;

    @Column(nullable = false)
    private LocalDate updatedAt;

    private LocalDate startsAt;

    private LocalDate endsAt;

    //todo Location and attachments have not been added yet, is that okay?

    public Incident() {
    }

    public Incident(long id, String title, long authorId,
                    String description, LocalDate startedAt) {
        setId(id);
        setTitle(title);
        setAuthorId(authorId);
        setDescription(description);
        setStartedAt(startedAt);
        setCreatedAt(LocalDate.now());
        setUpdatedAt(LocalDate.now());
    }

    public Incident(String title, long authorId,
                    String description, LocalDate startedAt) {
        setTitle(title);
        setAuthorId(authorId);
        setDescription(description);
        setStartedAt(startedAt);
        setCreatedAt(LocalDate.now());
        setUpdatedAt(LocalDate.now());
    }

    public Incident(long id, String title, long authorId, String description) {
        this(id, title, authorId, description, LocalDate.now());
    }

    public Incident(long id, String title, long authorId) {
        this(id, title, authorId, "");

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

    public LocalDate getStartedAt() {
        return startsAt;
    }

    public void setStartedAt(LocalDate startedAt) {
        this.startsAt = startedAt;
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
        return id == incident.id
            && isClosed == incident.isClosed
            && title.equals(incident.title)
            && authorId.equals(incident.authorId)
            && Objects.equals(description, incident.description)
            && Objects.equals(closeReason, incident.closeReason)
            && createdAt.equals(incident.createdAt)
            && updatedAt.equals(incident.updatedAt)
            && startsAt.equals(incident.startsAt)
            && Objects.equals(endsAt, incident.endsAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
            id, title, authorId, description, closeReason,
            isClosed, createdAt, updatedAt, startsAt, endsAt
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
            + ", startDate=" + startsAt
            + ", endDate=" + endsAt
            + '}';
    }
}
