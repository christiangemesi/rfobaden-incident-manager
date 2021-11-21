package ch.rfobaden.incidentmanager.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.Objects;
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
@Table(name = "report")
public class Report implements Completable {

    enum Priority {
        LOW, MEDIUM, HIGH
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false)
    private Long id;

    @OneToOne
    @JoinColumn(nullable = false)
    private User author;

    @OneToOne
    private User assignee;

    @ManyToOne
    @JoinColumn(name = "incident_id", nullable = false)
    private Incident incident;

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

    @OneToOne
    @JoinColumn(name = "report")
    private Completion completion;

    private boolean isComplete;

    private String location;

    private Priority priority = Priority.MEDIUM;

    public Report() {
    }

    public Report(Long id, String title, User author, Incident incident) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.incident = incident;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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

    public Long getAssigneeId() {
        if (assignee == null) {
            return null;
        }
        return assignee.getId();
    }

    public void setAssignee(User assignee) {
        this.assignee = assignee;
    }

    @JsonIgnore
    public Incident getIncident() {
        return incident;
    }

    public Long getIncidentId() {
        if (incident == null) {
            return null;
        }
        return incident.getId();
    }

    @JsonProperty
    public void setIncident(Incident incident) {
        this.incident = incident;
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
    public void close(String reason) {
        Completion c = new Completion(reason);
        c.setPrevious(completion);
        completion = c;
        this.isComplete = true;
    }

    @Override
    public void reopen() {
        if (completion != null) {
            isComplete = false;
        }
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
        return isComplete == report.isComplete
                && Objects.equals(id, report.id)
                && Objects.equals(author, report.author)
                && Objects.equals(assignee, report.assignee)
                && Objects.equals(incident, report.incident)
                && Objects.equals(title, report.title)
                && Objects.equals(description, report.description)
                && Objects.equals(addendum, report.addendum)
                && Objects.equals(createdAt, report.createdAt)
                && Objects.equals(updatedAt, report.updatedAt)
                && Objects.equals(startsAt, report.startsAt)
                && Objects.equals(endsAt, report.endsAt)
                && Objects.equals(completion, report.completion)
                && Objects.equals(location, report.location)
                && priority == report.priority;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, author, getAssigneeId(), getIncidentId(), title,
                description, addendum, createdAt, updatedAt, startsAt,
                endsAt, completion, isComplete, location, priority);
    }

    @Override
    public String toString() {
        return "Report{"
                + "id=" + id
                + ", author=" + author
                + ", assigneeId=" + getAssigneeId()
                + ", incidentId=" + getIncidentId()
                + ", title='" + title + '\''
                + ", description='" + description + '\''
                + ", addendum='" + addendum + '\''
                + ", createdAt=" + createdAt
                + ", updatedAt=" + updatedAt
                + ", startsAt=" + startsAt
                + ", isComplete=" + isComplete
                + ", location='" + location + '\''
                + ", priority=" + priority
                + '}';
    }
}



