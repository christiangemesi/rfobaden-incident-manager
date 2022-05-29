package ch.rfobaden.incidentmanager.backend.models;

import ch.rfobaden.incidentmanager.backend.models.paths.PathConvertible;
import ch.rfobaden.incidentmanager.backend.models.paths.ReportPath;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * {@code Report} represents a report handled in an {@link Incident}.
 * It can be further divided into {@link Task tasks}.
 */
@Entity
@Table(name = "report")
public class Report extends TrackableModel
    implements PathConvertible<ReportPath>, ImageOwner, DocumentOwner {

    /**
     * The {@link Incident} the report belongs to.
     */
    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Incident incident;

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
    public Incident getIncident() {
        return incident;
    }

    /**
     * The id of the incident to which the report belongs.
     *
     * @return The incident's id.
     */
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

    @JsonIgnore
    public List<Task> getTasks() {
        return tasks;
    }

    @JsonIgnore
    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
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
     * @return Whether the report is done.
     */
    @JsonProperty("isDone")
    public boolean isDone() {
        return !getTasks().isEmpty()
            && (getTasks().stream().allMatch(Task::isClosed)
            || getTasks().stream().allMatch(Task::isDone));
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
        return equalsTrackableModel(report)
            && Objects.equals(incident, report.incident)
            && Objects.equals(entryType, report.entryType)
            && Objects.equals(notes, report.notes)
            && Objects.equals(location, report.location)
            && Objects.equals(isKeyReport, report.isKeyReport)
            && Objects.equals(isLocationRelevantReport, report.isLocationRelevantReport);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
            trackableModelHashCode(),
            incident,
            entryType,
            notes,
            location,
            isKeyReport,
            isLocationRelevantReport
        );
    }

    @Override
    public ReportPath toPath() {
        ReportPath path = new ReportPath();
        path.setIncidentId(getIncidentId());
        return path;
    }
}
