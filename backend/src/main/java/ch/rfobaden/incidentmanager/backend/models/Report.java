package ch.rfobaden.incidentmanager.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "report")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false)
    private Long id = -1L;

    @OneToOne
    @JoinColumn(nullable = false)
    private User author;

    @OneToOne
    private User assignedTo;

    @ManyToOne
    @JoinColumn(name = "incident_id", nullable = false)
    private Incident incident;

    @Column(nullable = false)
    private String title;

    private String description;

    private String adendum;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    private LocalDateTime startsAt;

    private LocalDateTime endsAt;

    @OneToMany
    @JoinColumn(name = "report")
    private Set<Closure> closures;

    private String location;

    private Priority priority;

    public Report() {
    }

    // TODO: only fields with non-null params
    public Report(String title, User author, Incident incident) {
        this(-1L, title, author, incident);
    }


    public Report(Long id, String title, User author, Incident incident) {
        this(id, title, " ", author, null, incident, LocalDateTime.now(), Priority.MEDIUM);
    }

    // TODO: How do I decide which different ctor's are necessary...?
    public Report(Long id, String title, String description, User author, User assignedTo,
                  Incident incident, LocalDateTime startsAt, Priority priority) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.author = author;
        this.assignedTo = assignedTo;
        this.incident = incident;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = createdAt;
        this.startsAt = startsAt;
        this.priority = priority;
        closures = new HashSet<>();
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

    public User getAssignedTo() {
        return assignedTo;
    }

    public Long getAssigneeId() {
        if (assignedTo == null) {
            return null;
        }
        return assignedTo.getId();
    }

    public void setAssignedTo(User assignee) {
        this.assignedTo = assignee;
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

    public String getAdendum() {
        return adendum;
    }

    public void setAdendum(String adendum) {
        this.adendum = adendum;
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

    public Set<Closure> getClosures() {
        if (Objects.isNull(closures)) {
            return null;
        }
        return Collections.unmodifiableSet(closures);
    }

    // TODO: delete setClosures?
    public void setClosures(Set<Closure> closures) {
        this.closures = closures;
    }

    public boolean addClosure(Closure closure) {
        if (Objects.isNull(closure)) {
            return false;
        }
        return closures.add(closure);
    }

    public boolean removeClosure(Closure closure) {
        if (Objects.isNull(closure)) {
            return false;
        }
        return closures.remove(closure);
    }

    // TODO: unnecessary
    public void clearClosures() {
        closures.clear();
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
        Report report = (Report) o;
        return id.equals(report.id)
                && author.equals(report.author)
                && assignedTo.equals(report.assignedTo)
                && incident.equals(report.incident)
                && title.equals(report.title)
                && description.equals(report.description)
                && adendum.equals(report.adendum)
                && createdAt.equals(report.createdAt)
                && updatedAt.equals(report.updatedAt)
                && startsAt.equals(report.startsAt)
                && endsAt.equals(report.endsAt)
                && closures.equals(report.closures)
                && location.equals(report.location)
                && priority == report.priority;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, author, assignedTo, incident, title, description,
                adendum, createdAt, updatedAt, startsAt, endsAt, closures, location, priority);
    }

    @Override
    public String toString() {
        return "Report{"
                + "id=" + id
                + ", author=" + getAuthorId()
                + ", assignedToId=" + getAssigneeId()
                + ", incidentId=" + getIncidentId()
                + ", title='" + title + '\''
                + ", description='" + description + '\''
                + ", adendum='" + adendum + '\''
                + ", createdAt=" + createdAt
                + ", updatedAt=" + updatedAt
                + ", startsAt=" + startsAt
                + ", endsAt=" + endsAt
                + ", closures=" + closures
                + ", location='" + location + '\''
                + ", priority=" + priority
                + '}';
    }
}
