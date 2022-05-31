package ch.rfobaden.incidentmanager.backend.models;

import ch.rfobaden.incidentmanager.backend.models.paths.PathConvertible;
import ch.rfobaden.incidentmanager.backend.models.paths.SubtaskPath;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

/**
 * {@code Subtask} represents a subtask, which is pat of a {@link Task}.
 */
@Entity
@Table(name = "subtask")
public class Subtask extends TrackableModel
    implements PathConvertible<SubtaskPath>, ImageOwner, DocumentOwner {

    /**
     * The {@link Task} the subtask belongs to.
     */
    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Task task;

    /**
     * The images attached to the subtask, stored as {@link Document} instances.
     */
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Document> images = new ArrayList<>();

    /**
     * The {@link Document documents} attached to the subtask.
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
     * The id of the incident to which the subtask belongs.
     *
     * @return The incident's id.
     */
    public Long getIncidentId() {
        if (task == null) {
            return null;
        }
        return task.getReport().getIncidentId();
    }

    /**
     * Allows access to the {@link Report report}'s id.
     *
     * @return The report's id.
     */
    public Long getReportId() {
        if (task == null) {
            return null;
        }
        return task.getReportId();
    }

    /**
     * Allows access to the {@link #getTask() task}'s id.
     *
     * @return The task's id.
     */
    public Long getTaskId() {
        if (task == null) {
            return null;
        }
        return task.getId();
    }

    @JsonIgnore
    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    @Override
    public String getLink() {
        return getTask().getLink() + "/unterauftraege/" + getId();
    }

    @Override
    public String getFullTitle() {
        return getTask().getFullTitle() + "/" + getTitle();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Subtask subtask = (Subtask) o;
        return equalsTrackableModel(subtask)
            && Objects.equals(task, subtask.task);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
            trackableModelHashCode(),
            task
        );
    }

    @Override
    public SubtaskPath toPath() {
        var path = new SubtaskPath();
        path.setIncidentId(getTask().getReport().getIncidentId());
        path.setReportId(getTask().getReportId());
        path.setTaskId(getTaskId());
        return path;
    }
}
