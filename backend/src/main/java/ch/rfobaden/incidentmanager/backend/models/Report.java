package ch.rfobaden.incidentmanager.backend.models;

import ch.rfobaden.incidentmanager.backend.models.paths.PathConvertible;
import ch.rfobaden.incidentmanager.backend.models.paths.ReportPath;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
@Table(name = "report")
public class Report extends Model implements PathConvertible<ReportPath>, Serializable {
    private static final long serialVersionUID = 1L;

    @ManyToOne
    @JoinColumn
    private User assignee;

    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Incident incident;

    @Size(max = 100)
    @NotBlank
    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private LocalDateTime startsAt;

    private LocalDateTime endsAt;

    @Size(max = 100)
    private String location;

    @NotNull
    @Column(nullable = false)
    private boolean isClosed;

    @NotNull
    @Column(nullable = false)
    private boolean isKeyReport;

    @NotNull
    @Column(nullable = false)
    private boolean isLocationRelevantReport;

    @NotNull
    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false)
    private Priority priority;

    @OneToMany(mappedBy = "report", cascade = CascadeType.REMOVE)
    private List<Task> tasks = new ArrayList<>();

    @JsonIgnore
    public User getAssignee() {
        return assignee;
    }

    @JsonIgnore
    public void setAssignee(User assignee) {
        this.assignee = assignee;
    }

    @JsonProperty
    public Long getAssigneeId() {
        if (assignee == null) {
            return null;
        }
        return assignee.getId();
    }

    @JsonProperty
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

    @JsonProperty
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

    @JsonProperty("isKeyReport")
    public boolean isKeyReport() {
        return isKeyReport;
    }

    public void setKeyReport(boolean keyReport) {
        isKeyReport = keyReport;
    }

    @JsonProperty("isLocationRelevantReport")
    public boolean isLocationRelevantReport() {
        return isLocationRelevantReport;
    }

    public void setLocationRelevantReport(boolean locationRelevantReport) {
        isLocationRelevantReport = locationRelevantReport;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    @JsonIgnore
    public List<Task> getTasks() {
        return tasks;
    }

    @JsonIgnore
    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }

    public List<Long> getTaskIds() {
        return getTasks().stream().map(Task::getId).collect(Collectors.toList());
    }

    public List<Long> getClosedTaskIds() {
        return getTasks().stream()
            .filter(t -> t.isClosed() || t.isDone())
            .map(Task::getId)
            .collect(Collectors.toList());
    }

    @JsonProperty("isDone")
    public boolean isDone() {
        return !getTasks().isEmpty()
            && (getTasks().stream().allMatch(Task::isClosed)
            || getTasks().stream().allMatch(Task::isDone));
    }

    @JsonProperty("isClosed")
    public boolean isClosed() {
        return isClosed;
    }

    public void setClosed(boolean closed) {
        isClosed = closed;
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
            && Objects.equals(isClosed, report.isClosed)
            && Objects.equals(isKeyReport, report.isKeyReport)
            && Objects.equals(isLocationRelevantReport, report.isLocationRelevantReport)
            && priority == report.priority;
    }

    @Override
    public int hashCode() {
        return Objects.hash(assignee, incident, title,
            description, notes, startsAt,
            endsAt, location, isClosed, isKeyReport, isLocationRelevantReport, priority);
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



