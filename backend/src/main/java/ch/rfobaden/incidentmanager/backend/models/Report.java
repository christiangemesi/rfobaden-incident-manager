package ch.rfobaden.incidentmanager.backend.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.time.LocalDateTime;
import java.util.Objects;

import ch.rfobaden.incidentmanager.backend.models.paths.PathConvertible;
import ch.rfobaden.incidentmanager.backend.models.paths.ReportPath;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "report")
public class Report extends Model implements PathConvertible<ReportPath> {
    @ManyToOne
    @JoinColumn
    private User assignee;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Incident incident;

    @Column(nullable = false)
    private String title;

    private String description;

    private String notes;

    private LocalDateTime startsAt;

    private LocalDateTime endsAt;

    private String location;

    @Column(nullable = false)
    private Priority priority;

    public User getAssignee() {
        return assignee;
    }

    public void setAssignee(User assignee) {
        this.assignee = assignee;
    }

    public Long getAssigneeId() {
        if (assignee == null) {
            return null;
        }
        return assignee.getId();
    }

    public void setAssigneeId(Long assigneeId) {
        if (assigneeId == null) {
            this.assignee = null;
            return;
        }
        if (this.assignee == null) {
            this.assignee = new User();
        }
        this.assignee.setId(assigneeId);
    }

    @JsonIgnore
    public Incident getIncident() {
        return incident;
    }

    @JsonIgnore
    public Long getIncidentId() {
        if (incident == null) {
            return null;
        }
        return incident.getId();
    }

    @JsonIgnore
    public void setIncident(Incident incident) {
        this.incident = incident;
    }

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

    public String getNotes() {
        return notes;
    }

    public void setNotes(String addendum) {
        this.notes = addendum;
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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
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
        return equalsModel(report)
            && Objects.equals(assignee, report.assignee)
            && Objects.equals(incident, report.incident)
            && Objects.equals(title, report.title)
            && Objects.equals(description, report.description)
            && Objects.equals(notes, report.notes)
            && Objects.equals(startsAt, report.startsAt)
            && Objects.equals(endsAt, report.endsAt)
            && Objects.equals(location, report.location)
            && priority == report.priority;
    }

    @Override
    public int hashCode() {
        return Objects.hash(assignee, incident, title,
            description, notes, startsAt,
            endsAt, location, priority);
    }

    @Override
    public String toString() {
        return "Report{"
            + "id=" + getId()
            + ", assignee=" + assignee
            + ", incident=" + incident
            + ", title='" + title + '\''
            + ", description='" + description + '\''
            + ", addendum='" + notes + '\''
            + ", createdAt=" + getCreatedAt() + '\''
            + ", updatedAt=" + getUpdatedAt() + '\''
            + ", startsAt=" + startsAt + '\''
            + ", endsAt=" + endsAt + '\''
            + ", location='" + location + '\''
            + ", priority=" + priority
            + '}';
    }

    @Override
    public ReportPath toPath() {
        ReportPath path = new ReportPath();
        path.setIncidentId(getIncidentId());
        return path;
    }

    public enum Priority {
        LOW, MEDIUM, HIGH
    }
}



