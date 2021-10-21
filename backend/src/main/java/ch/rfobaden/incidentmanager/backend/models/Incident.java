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
    private LocalDate creationDate;
    @Column(nullable = false)
    private LocalDate updateDate;
    @Column(nullable = false)
    private LocalDate startDate;
    private LocalDate endDate;
    //todo Location and attachments have not been added yet, is that okay?

    public Incident() {
    }

    public Incident(long id, String title, long authorId,
                    String description, LocalDate startDate) {
        setId(id);
        setTitle(title);
        setAuthorId(authorId);
        setDescription(description);
        setStartDate(startDate);
        setCreationDate(LocalDate.now());
        setUpdateDate(LocalDate.now());
    }

    public Incident(String title, long authorId,
                    String description, LocalDate startDate) {
        setTitle(title);
        setAuthorId(authorId);
        setDescription(description);
        setStartDate(startDate);
        setCreationDate(LocalDate.now());
        setUpdateDate(LocalDate.now());
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

    public LocalDate getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }

    public LocalDate getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(LocalDate updateDate) {
        this.updateDate = updateDate;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Incident incident = (Incident) o;
        return id == incident.id && isClosed == incident.isClosed && title.equals(incident.title) && authorId.equals(incident.authorId) && Objects.equals(description, incident.description) && Objects.equals(closeReason, incident.closeReason) && creationDate.equals(incident.creationDate) && updateDate.equals(incident.updateDate) && startDate.equals(incident.startDate) && Objects.equals(endDate, incident.endDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title, authorId, description, closeReason, isClosed, creationDate, updateDate, startDate, endDate);
    }

    @Override
    public String toString() {
        return "Incident{" +
            "id=" + id +
            ", title='" + title + '\'' +
            ", authorId=" + authorId +
            ", description='" + description + '\'' +
            ", closeReason='" + closeReason + '\'' +
            ", isClosed=" + isClosed +
            ", creationDate=" + creationDate +
            ", updateDate=" + updateDate +
            ", startDate=" + startDate +
            ", endDate=" + endDate +
            '}';
    }
}
