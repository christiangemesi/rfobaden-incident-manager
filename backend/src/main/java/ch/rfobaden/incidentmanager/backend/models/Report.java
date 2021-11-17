package ch.rfobaden.incidentmanager.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "report")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false)
    private Long id = -1L;

    @ManyToOne
    @JoinColumn(name = "incident", nullable = false)
    private Incident incident;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private Long authorId;

    private Long assigneeId;

    private String description;

    private String adendum;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime startsAt;

    private LocalDateTime endsAt;

    private LocalDateTime closedAt;

    private boolean isClosed;

    private String closeReason;

    private String location;

    // TODO: type
    private String priority;

    public Report() {
    }

    public Report(String title, Long authorId) {
        this(-1L, title, authorId);
    }

    public Report(Long id, String title, Long authorId) {
        this.id = id;
        this.title = title;
        this.authorId = authorId;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    @JsonIgnore
    public Incident getIncident() {
        return incident;
    }

    public Long getIncidentId() {
        if (incident == null) {
            return null;
        }
        return incident.getId();
    }

    public String getTitle() {
        return title;
    }

    public Long getAuthorId() {
        return authorId;
    }

    public String getDescription() {
        return description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @JsonProperty
    public void setIncident(Incident incident) {
        this.incident = incident;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Report report = (Report) o;
        return Objects.equals(id, report.id)
                && Objects.equals(getIncidentId(), report.getIncidentId())
                && Objects.equals(title, report.title)
                && Objects.equals(authorId, report.authorId)
                && Objects.equals(description, report.description)
                && Objects.equals(createdAt, report.createdAt)
                && Objects.equals(updatedAt, report.updatedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, getIncidentId(), title, authorId, description, createdAt, updatedAt);
    }

    @Override
    public String toString() {
        return "Report{"
                + "id=" + id
                + ", incidentId=" + getIncidentId()
                + ", title='" + title + '\''
                + ", authorId=" + authorId
                + ", description='" + description + '\''
                + ", createdAt=" + createdAt
                + ", updatedAt=" + updatedAt
                + '}';
    }
}
