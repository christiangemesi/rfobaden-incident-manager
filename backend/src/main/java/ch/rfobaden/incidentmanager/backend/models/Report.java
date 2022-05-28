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

@Entity
@Table(name = "report")
public class Report extends TrackableModel
    implements PathConvertible<ReportPath>, ImageOwner, DocumentOwner {

    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Incident incident;

    @NotNull
    @OneToOne(cascade = CascadeType.ALL)
    private EntryType entryType;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Size(max = 100)
    private String location;

    @NotNull
    @Column(nullable = false)
    private boolean isKeyReport;

    @NotNull
    @Column(nullable = false)
    private boolean isLocationRelevantReport;

    @OneToMany(mappedBy = "report", cascade = CascadeType.REMOVE)
    private List<Task> tasks = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Document> images = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Document> documents = new ArrayList<>();

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
