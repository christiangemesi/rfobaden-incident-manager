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

/**
 * {@code Task} represents a task handled in an {@link Report}.
 * It can be further divided into {@link Subtask subtasks}.
 */
@Entity
@Table(name = "task")
public class Task extends TrackableModel
    implements PathConvertible<TaskPath>, ImageOwner, DocumentOwner {

    /**
     * The {@link Report} the task belongs to.
     */
    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Report report;

    /**
     * The location at which the task takes place.
     */
    @Size(max = 100)
    private String location;

    /**
     * The {@link Subtask subtasks} of the task.
     */
    @OneToMany(mappedBy = "task", cascade = CascadeType.REMOVE)
    private List<Subtask> subtasks = new ArrayList<>();

    /**
     * The images attached to the task, stored as {@link Document} instances.
     */
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Document> images = new ArrayList<>();

    /**
     * The {@link Document documents} attached to the task.
     * Does not include the entity's {@link #images image documents}.
     */
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

    /**
     * Allows access to the {@link Incident incident}'s id.
     *
     * @return The incident's id.
     */
    @JsonProperty
    public Long getIncidentId() {
        if (report == null) {
            return null;
        }
        return report.getIncident().getId();
    }

    /**
     * Allows access to the {@link #getReport() report}'s id.
     *
     * @return The report's id.
     */
    @JsonProperty
    public Long getReportId() {
        if (report == null) {
            return null;
        }
        return report.getId();
    }

    @JsonIgnore
    public Report getReport() {
        return report;
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

    /**
     * Lists the {@link Subtask#getId() ids} of all {@link #getSubtasks() subtasks}.
     *
     * @return The ids of all subtasks.
     */
    public List<Long> getSubtaskIds() {
        return getSubtasks().stream().map(Subtask::getId).collect(Collectors.toList());
    }

    /**
     * Lists the {@link Subtask#getId() ids} of all closed {@link #getSubtasks() subtasks}.
     *
     * @return The ids of all closed subtasks.
     */
    public List<Long> getClosedSubtaskIds() {
        return getSubtasks().stream()
            .filter(Subtask::isClosed)
            .map(Subtask::getId)
            .collect(Collectors.toList());
    }

    /**
     * Whether the task is done.
     * A task is done when all its {@link #getSubtasks() subtasks} are all closed or done.
     *
     * @return Whether the task is done.
     */
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
