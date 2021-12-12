package ch.rfobaden.incidentmanager.backend.models;

import ch.rfobaden.incidentmanager.backend.models.paths.PathConvertible;
import ch.rfobaden.incidentmanager.backend.models.paths.SubtaskPath;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "subtask")
public class Subtask extends Model implements PathConvertible<SubtaskPath> {

    @ManyToOne
    @JoinColumn
    private User assignee;

    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Task task;

    @Column(nullable = false)
    private String title;

    private String description;

    private LocalDateTime startsAt;

    private LocalDateTime endsAt;

    @Column(nullable = false)
    private boolean isClosed;

    @Column(nullable = false)
    private Priority priority;

    @JsonIgnore
    public User getAssignee() {
        return assignee;
    }

    @JsonIgnore
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
    public Task getTask() {
        return task;
    }

    public Long getTaskId() {
        if (task == null) {
            return null;
        }
        return task.getId();
    }

    public Long getReportId() {
        if (task == null) {
            return null;
        }
        return task.getReportId();
    }

    public Long getIncidentId() {
        if (task == null) {
            return null;
        }
        return task.getReport().getIncidentId();
    }

    @JsonProperty
    public void setTask(Task task) {
        this.task = task;
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

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
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
        return Objects.hash(modelHashCode(), assignee, task, title,
            description, startsAt, endsAt, priority, isClosed);
    }

    @Override
    public String toString() {
        return "Subtask{"
            + "id=" + getId()
            + ", assignee =" + assignee
            + ", task=" + task
            + ", title='" + title + '\''
            + ", description='" + description + '\''
            + ", createdAt=" + getCreatedAt()
            + ", updatedAt=" + getUpdatedAt()
            + ", startsAt=" + startsAt
            + ", priority=" + priority
            + ", isClosed=" + isClosed
            + '}';
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
