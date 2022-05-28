package ch.rfobaden.incidentmanager.backend.models;

import ch.rfobaden.incidentmanager.backend.models.paths.PathConvertible;
import ch.rfobaden.incidentmanager.backend.models.paths.SubtaskPath;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * {@code Subtask} represents a subtask, which is pat of a {@link Task}.
 */
@Entity
@Table(name = "subtask")
public class Subtask extends Model
    implements PathConvertible<SubtaskPath>, Trackable, ImageOwner, DocumentOwner, Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * The {@link User assignee} responsible for the completion of the subtasks.
     */
    @ManyToOne
    @JoinColumn
    private User assignee;

    /**
     * The {@link Task} the subtask belongs to.
     */
    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Task task;

    /**
     * The title of the subtask.
     */
    @Size(max = 100)
    @NotBlank
    @Column(nullable = false)
    private String title;

    /**
     * A textual description of what the subtask is about.
     */
    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * The moment in time at which the transport will start.
     * This represents the actual time at which the real-life event
     * managed in this entity will start.
     * <p>
     * This is used to plan a subtask in advance.
     * </p>
     */
    private LocalDateTime startsAt;

    /**
     * The moment in time at which the transport will end.
     * This represents the actual time at which the real-life event
     * managed in this entity will end.
     */
    private LocalDateTime endsAt;

    /**
     * Whether the subtask is closed.
     * A closed subtask counts as completed.
     */
    @NotNull
    @Column(nullable = false)
    private boolean isClosed;

    /**
     * The priority of the subtask.
     */
    @NotNull
    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false)
    private Priority priority;

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

    @JsonIgnore
    public User getAssignee() {
        return assignee;
    }

    @Override
    public void setAssignee(User assignee) {
        this.assignee = assignee;
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
     * Allows access to the {@link #getTask().getReport() report}'s id.
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

    @Override
    public Priority getPriority() {
        return priority;
    }

    @Override
    public void setPriority(Priority priority) {
        this.priority = priority;
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
        return equalsModel(subtask)
            && Objects.equals(assignee, subtask.assignee)
            && Objects.equals(task, subtask.task)
            && Objects.equals(title, subtask.title)
            && Objects.equals(description, subtask.description)
            && Objects.equals(startsAt, subtask.startsAt)
            && Objects.equals(endsAt, subtask.endsAt)
            && Objects.equals(isClosed, subtask.isClosed)
            && priority == subtask.priority;
    }

    @Override
    public int hashCode() {
        return Objects.hash(
            modelHashCode(),
            assignee,
            task,
            title,
            description,
            startsAt,
            endsAt,
            priority,
            isClosed
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
