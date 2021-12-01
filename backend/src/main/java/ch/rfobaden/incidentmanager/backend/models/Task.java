package ch.rfobaden.incidentmanager.backend.models;

import ch.rfobaden.incidentmanager.backend.models.paths.PathConvertible;
import ch.rfobaden.incidentmanager.backend.models.paths.TaskPath;
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
@Table(name = "task")
public class Task extends Model implements PathConvertible<TaskPath> {

    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private User author;

    @ManyToOne
    @JoinColumn
    private User assignee;

    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Report report;

    @Column(nullable = false)
    private String title;

    private String description;

    private String addendum;

    private LocalDateTime startsAt;

    private LocalDateTime endsAt;

    private String location;

    @Column(nullable = false)
    private Priority priority;

    public User getAuthor() {
        return author;
    }

    public Long getAuthorId() {
        if (author == null) {
            return null;
        }
        return author.getId();
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public User getAssignee() {
        return assignee;
    }

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
    public Report getReport() {
        return report;
    }

    public Long getReportId() {
        if (report == null) {
            return null;
        }
        return report.getId();
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

    public String getAddendum() {
        return addendum;
    }

    public void setAddendum(String addendum) {
        this.addendum = addendum;
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
            && Objects.equals(author, task.author)
            && Objects.equals(assignee, task.assignee)
            && Objects.equals(report, task.report)
            && Objects.equals(title, task.title)
            && Objects.equals(description, task.description)
            && Objects.equals(addendum, task.addendum)
            && Objects.equals(startsAt, task.startsAt)
            && Objects.equals(endsAt, task.endsAt)
            && Objects.equals(location, task.location)
            && priority == task.priority;
    }

    @Override
    public int hashCode() {
        return Objects.hash(modelHashCode(), author, assignee, report, title,
            description, addendum, startsAt,
            endsAt, location, priority);
    }

    @Override
    public String toString() {
        return "Task{"
            + "id=" + getId()
            + ", author=" + author
            + ", assignee =" + assignee
            + ", report=" + report
            + ", title='" + title + '\''
            + ", description='" + description + '\''
            + ", addendum='" + addendum + '\''
            + ", createdAt=" + getCreatedAt()
            + ", updatedAt=" + getUpdatedAt()
            + ", startsAt=" + startsAt
            + ", location='" + location + '\''
            + ", priority=" + priority
            + '}';
    }


    @Override
    public TaskPath toPath() {
        var path = new TaskPath();
        path.setIncidentId(getReport().getIncident().getId());
        path.setReportId(getReport().getId());
        return path;
    }
}
