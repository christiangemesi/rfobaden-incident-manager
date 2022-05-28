package ch.rfobaden.incidentmanager.backend.models;

import ch.rfobaden.incidentmanager.backend.models.paths.PathConvertible;
import ch.rfobaden.incidentmanager.backend.models.paths.TaskPath;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
@Table(name = "task")
public class Task extends TrackableModel
    implements PathConvertible<TaskPath>, ImageOwner, DocumentOwner {

    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Report report;

    @Size(max = 100)
    private String location;

    @OneToMany(mappedBy = "task", cascade = CascadeType.REMOVE)
    private List<Subtask> subtasks = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Document> images = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Document> documents = new ArrayList<>();

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

    @JsonIgnore
    public Report getReport() {
        return report;
    }

    @JsonProperty
    public Long getReportId() {
        if (report == null) {
            return null;
        }
        return report.getId();
    }

    @JsonProperty
    public Long getIncidentId() {
        if (report == null) {
            return null;
        }
        return report.getIncident().getId();
    }

    @JsonProperty
    public void setReport(Report report) {
        this.report = report;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    @JsonIgnore
    public List<Subtask> getSubtasks() {
        return subtasks;
    }

    @JsonIgnore
    public void setSubtasks(List<Subtask> subtasks) {
        this.subtasks = subtasks;
    }

    public List<Long> getSubtaskIds() {
        return getSubtasks().stream().map(Subtask::getId).collect(Collectors.toList());
    }

    public List<Long> getClosedSubtaskIds() {
        return getSubtasks().stream()
            .filter(Subtask::isClosed)
            .map(Subtask::getId)
            .collect(Collectors.toList());
    }

    @JsonProperty("isDone")
    public boolean isDone() {
        return !getSubtasks().isEmpty()
            && getSubtasks().stream().allMatch(Subtask::isClosed);
    }

    @Override
    public String getLink() {
        return getReport().getLink() + "/auftraege/" + getId();
    }

    @Override
    public String getFullTitle() {
        return getReport().getFullTitle() + "/" + getTitle();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Task task = (Task) o;
        return equalsTrackableModel(task)
            && Objects.equals(report, task.report)
            && Objects.equals(location, task.location);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
            trackableModelHashCode(),
            report,
            location
        );
    }


    @Override
    public TaskPath toPath() {
        var path = new TaskPath();
        path.setIncidentId(getReport().getIncident().getId());
        path.setReportId(getReport().getId());
        return path;
    }


}
