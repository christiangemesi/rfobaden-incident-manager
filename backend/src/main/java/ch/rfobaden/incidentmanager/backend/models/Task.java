package ch.rfobaden.incidentmanager.backend.models;

import ch.rfobaden.incidentmanager.backend.models.paths.PathConvertible;
import ch.rfobaden.incidentmanager.backend.models.paths.TaskPath;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "task")
public class Task extends Model implements PathConvertible<TaskPath>, Serializable {
    private static final long serialVersionUID = 1L;

    @ManyToOne
    @JoinColumn
    private User assignee;

    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Report report;

    @Column(nullable = false)
    private String title;

    private String description;

    private LocalDateTime startsAt;

    private LocalDateTime endsAt;

    private String location;

    @Column(nullable = false)
    private Priority priority;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "task", cascade = CascadeType.REMOVE)
    private List<Subtask> subtasks = new ArrayList<>();

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

    @JsonIgnore
    public List<Subtask> getSubtasks() {
        return subtasks;
    }

    @JsonIgnore
    public void setSubtasks(List<Subtask> subtasks) {
        this.subtasks = subtasks;
    }

    @JsonProperty("subtaskCount")
    public long getSubtaskCount() {
        return subtasks.size();
    }

    @JsonProperty("closedSubtaskCount")
    public long getClosedSubtaskCount() {
        return subtasks.stream().filter(Subtask::isClosed).count();
    }

    @JsonProperty("isClosed")
    public boolean isClosed() {
        return getSubtaskCount() == getClosedSubtaskCount() && getSubtaskCount() > 0;
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
        return equalsModel(task)
            && Objects.equals(assignee, task.assignee)
            && Objects.equals(report, task.report)
            && Objects.equals(title, task.title)
            && Objects.equals(description, task.description)
            && Objects.equals(startsAt, task.startsAt)
            && Objects.equals(endsAt, task.endsAt)
            && Objects.equals(location, task.location)
            && priority == task.priority;
    }

    @Override
    public int hashCode() {
        return Objects.hash(modelHashCode(), assignee, report, title,
            description, startsAt,
            endsAt, location, priority);
    }


    @Override
    public TaskPath toPath() {
        var path = new TaskPath();
        path.setIncidentId(getReport().getIncident().getId());
        path.setReportId(getReport().getId());
        return path;
    }
}
