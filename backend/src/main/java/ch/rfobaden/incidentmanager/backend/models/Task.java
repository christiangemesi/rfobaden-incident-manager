package ch.rfobaden.incidentmanager.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.Objects;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "task")
public class Task implements Completable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(nullable = false)
    private User author;

    @ManyToOne
    @JoinColumn
    private User assignee;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Report report;

    @Column(nullable = false)
    private String title;

    private String description;

    private String addendum;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    private LocalDateTime startsAt;

    private LocalDateTime endsAt;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "completion_id")
    private Completion completion;

    @Column(nullable = false)
    private boolean isComplete;

    private String location;


    @Column(nullable = false)
    private Priority priority;

    public Task() {
    }

    public Task(Long id, String title, User author, Report report) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.report = report;
    }

    public Long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
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
    public void setCompletion(Completion completion) {
        this.completion = completion;
    }

    @Override
    public Completion getCompletion() {
        return completion;
    }

    @Override
    public void setComplete(boolean isComplete) {
        this.isComplete = isComplete;
    }

    @Override
    public boolean isComplete() {
        return isComplete;
    }

    public Long getCompletionId() {
        if (completion == null) {
            return null;
        }
        return completion.getId();
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
        return isComplete == task.isComplete
            && Objects.equals(id, task.id)
            && Objects.equals(author, task.author)
            && Objects.equals(assignee, task.assignee)
            && Objects.equals(report, task.report)
            && Objects.equals(title, task.title)
            && Objects.equals(description, task.description)
            && Objects.equals(addendum, task.addendum)
            && Objects.equals(createdAt, task.createdAt)
            && Objects.equals(updatedAt, task.updatedAt)
            && Objects.equals(startsAt, task.startsAt)
            && Objects.equals(endsAt, task.endsAt)
            && Objects.equals(completion, task.completion)
            && Objects.equals(location, task.location)
            && priority == task.priority;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, author, assignee, report, title,
            description, addendum, createdAt, updatedAt, startsAt,
            endsAt, completion, isComplete, location, priority);
    }

    @Override
    public String toString() {
        return "Task{"
            + "id=" + id
            + ", author=" + author
            + ", assigneeId=" + assignee
            + ", reportId=" + report
            + ", title='" + title + '\''
            + ", description='" + description + '\''
            + ", addendum='" + addendum + '\''
            + ", createdAt=" + createdAt
            + ", updatedAt=" + updatedAt
            + ", startsAt=" + startsAt
            + ", isComplete=" + isComplete
            + ", completionId=" + completion
            + ", location='" + location + '\''
            + ", priority=" + priority
            + '}';
    }

    enum Priority {
        LOW, MEDIUM, HIGH
    }
}
