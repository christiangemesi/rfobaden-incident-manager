package ch.rfobaden.incidentmanager.backend.models;

import java.time.LocalDate;
import java.util.Objects;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * This is a JPA Entity that will be represented in the database.
 */
@Entity
@Table(name = "incident")
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String title;
    private long creatorId;
    private String description;
    private String closeReason;
    private boolean isClosed;

    //todo should Date be in the variable name?
    private LocalDate creationDate;
    private LocalDate updateDate;
    private LocalDate startDate;
    private LocalDate endDate;
    //todo Location and attachments have not been added yet, is that okay?

    public Incident() {
    }

    public Incident(long id, String title, long creatorId,
                    String description, LocalDate startDate) {
        setId(id);
        setTitle(title);
        setCreatorId(creatorId);
        setDescription(description);
        setStartDate(startDate);
        setCreationDate(LocalDate.now());
    }

    public Incident(long id, String title, long creatorId, String description) {
        this(id, title, creatorId, description, LocalDate.now());
    }

    public Incident(long id, String title, long creatorId) {
        this(id, title, creatorId, "");

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

    public long getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(long creatorId) {
        this.creatorId = creatorId;
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
    public int hashCode() {
        // TODO Check hash values
        return Objects.hash(id, title, creatorId, creationDate);
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
        return id == that.id
                && Objects.equals(title, that.title)
                && Objects.equals(creatorId, that.creatorId)
                && Objects.equals(creationDate, that.creationDate);
    }

    @Override
    public String toString() {
        // TODO add more values
        return "Incident {"
                + "id="
                + id
                + ", Title='" + title + '\''
                + ", CreatorId='" + creatorId + '\''
                + ", Creation Date ='" + creationDate.toString() + '\''
                + '}';
    }
}
