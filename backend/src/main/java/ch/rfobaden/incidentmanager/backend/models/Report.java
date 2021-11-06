package ch.rfobaden.incidentmanager.backend.models;

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

    // TODO check
    @ManyToOne
    @JoinColumn(name = "incident")
    private Incident incident;
    // or
    private Long incidentId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private Long authorId;

    private String description;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Report() {
    }

    public Report(Long id, String title) {

    }

    public Long getId() {
        return id;
    }

    public Incident getIncident() {
        return incident;
    }

    public Long getIncidentId() {
        return incidentId;
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

    public void setIncident(Incident incident) {
        this.incident = incident;
    }

    public void setIncidentId(Long incidentId) {
        this.incidentId = incidentId;
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
            && Objects.equals(incident, report.incident)
            && Objects.equals(incidentId, report.incidentId)
            && Objects.equals(title, report.title)
            && Objects.equals(authorId, report.authorId)
            && Objects.equals(description, report.description)
            && Objects.equals(createdAt, report.createdAt)
            && Objects.equals(updatedAt, report.updatedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, incident, incidentId, title, authorId, description, createdAt, updatedAt);
    }

    @Override
    public String toString() {
        return "Report{"
            + "id=" + id
            + ", incident=" + incident
            + ", incidentId=" + incidentId
            + ", title='" + title + '\''
            + ", authorId=" + authorId
            + ", description='" + description + '\''
            + ", createdAt=" + createdAt
            + ", updatedAt=" + updatedAt
            + '}';
    }
}
