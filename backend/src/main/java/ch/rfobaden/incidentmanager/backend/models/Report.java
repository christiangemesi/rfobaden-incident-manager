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
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * {@code Report} represents a report handled in an {@link Incident}.
 * It can be further divided into {@link Task tasks}.
 */
@Entity
@Table(name = "report")
public class Report extends Model
    implements PathConvertible<ReportPath>, Trackable, ImageOwner, DocumentOwner, Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * The {@link User assignee} responsible for the completion of the report.
     */
    @ManyToOne
    @JoinColumn
    private User assignee;

    /**
     * The {@link Incident} the report belongs to.
     */
    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Incident incident;

    /**
     * The title of the report.
     */
    @Size(max = 100)
    @NotBlank
    @Column(nullable = false)
    private String title;

    /**
     * A textual description of what the report is about.
     */
    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * The way the report was received.
     */
    @NotNull
    @OneToOne(cascade = CascadeType.ALL)
    private EntryType entryType;

    /**
     * Additional information about the report.
     */
    @Column(columnDefinition = "TEXT")
    private String notes;

    /**
     * Whether the report is closed.
     * A closed report counts as completed.
     */
    @NotNull
    @Column(nullable = false)
    private boolean isClosed;

    /**
     * The moment in time at which the report will start.
     * This represents the actual time at which the real-life event
     * managed in this entity will start.
     * <p>
     * This is used to plan a report in advance.
     * </p>
     */
    private LocalDateTime startsAt;

    /**
     * The moment in time at which the report will end.
     * This represents the actual time at which the real-life event
     * managed in this entity will end.
     */
    private LocalDateTime endsAt;

    /**
     * The location at which the report takes place.
     */
    @Size(max = 100)
    private String location;

    /**
     * Whether the report is one of the currently most important reports
     * of its {@link #incident Incident}.
     */
    @NotNull
    @Column(nullable = false)
    private boolean isKeyReport;

    /**
     * Whether the report affects its location, making it important to
     * other reports happening in the same place.
     */
    @NotNull
    @Column(nullable = false)
    private boolean isLocationRelevantReport;

    /**
     * The priority of the report.
     */
    @NotNull
    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false)
    private Priority priority;

    /**
     * The {@link Task tasks} of the report.
     */
    @OneToMany(mappedBy = "report", cascade = CascadeType.REMOVE)
    private List<Task> tasks = new ArrayList<>();

    /**
     * The images attached to the report, stored as {@link Document} instances.
     */
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Document> images = new ArrayList<>();

    /**
     * The {@link Document documents} attached to the report.
     * Does not include the entity's {@link #images image documents}.
     */
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Document> documents = new ArrayList<>();

    @JsonIgnore
    public User getAssignee() {
        return assignee;
    }

    @Override
    public void setAssignee(User assignee) {
        this.assignee = assignee;
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

    @Override
    public String getTitle() {
        return title;
    }

    @Override
    public void setTitle(String title) {
        this.title = title;
    }

    @Override
    public String getDescription() {
        return description;
    }

    @Override
    public void setDescription(String description) {
        this.description = description;
    }

    public EntryType getEntryType() {
        return entryType;
    }

    public void setEntryType(EntryType entryType) {
        this.entryType = entryType;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String addendum) {
        this.notes = addendum;
    }

    @Override
    public boolean isClosed() {
        return isClosed;
    }

    @Override
    public void setClosed(boolean closed) {
        isClosed = closed;
    }

    @Override
    public LocalDateTime getStartsAt() {
        return startsAt;
    }

    @Override
    public void setStartsAt(LocalDateTime startsAt) {
        this.startsAt = startsAt;
    }

    @Override
    public LocalDateTime getEndsAt() {
        return endsAt;
    }

    @Override
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

    @Override
    public Priority getPriority() {
        return priority;
    }

    @Override
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

    @Override
    public List<Document> getImages() {
        return images;
    }

    @Override
    public void setImages(List<Document> images) {
        this.images = images;
    }

    @Override
    public List<Document> getDocuments() {
        return documents;
    }

    @Override
    public void setDocuments(List<Document> documents) {
        this.documents = documents;
    }

    /**
     * Lists the {@link Task#getId() ids} of all {@link #getTasks tasks}.
     *
     * @return The ids of all tasks.
     */
    public List<Long> getTaskIds() {
        return getTasks().stream().map(Task::getId).collect(Collectors.toList());
    }

    /**
     * Lists the {@link Task#getId() ids} of all closed {@link #getTasks() tasks}.
     *
     * @return The ids of all closed tasks.
     */
    public List<Long> getClosedTaskIds() {
        return getTasks().stream()
            .filter(t -> t.isClosed() || t.isDone())
            .map(Task::getId)
            .collect(Collectors.toList());
    }

    /**
     * Whether the report is done.
     * A report is done when all its {@link #getTasks() tasks} are all closed or done.
     *
     * @return Whether the entity is done.
     */
    @JsonProperty("isDone")
    public boolean isDone() {
        return !getTasks().isEmpty()
            && (getTasks().stream().allMatch(Task::isClosed)
            || getTasks().stream().allMatch(Task::isDone));
    }

    @Override
    public String getLink() {
        return "/ereignisse/" + getIncident().getId() + "/meldungen/" + getId();
    }

    @Override
    public String getFullTitle() {
        return getIncident().getTitle() + "/" + getTitle();
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
            && Objects.equals(entryType, report.entryType)
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
        return Objects.hash(
            modelHashCode(),
            assignee,
            incident,
            title,
            description,
            entryType,
            notes,
            startsAt,
            endsAt,
            location,
            isClosed,
            isKeyReport,
            isLocationRelevantReport,
            priority
        );
    }

    @Override
    public ReportPath toPath() {
        ReportPath path = new ReportPath();
        path.setIncidentId(getIncidentId());
        return path;
    }
}
