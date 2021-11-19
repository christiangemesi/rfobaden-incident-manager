package ch.rfobaden.incidentmanager.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.List;
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
    @JoinColumn(name = "user", nullable = false)
    private User author;

    @OneToOne
    private User assignedTo;

    @ManyToOne
    @JoinColumn(name = "incident", nullable = false)
    private Incident incident;


    @Column(nullable = false)
    private String title;

    private String description;

    private String adendum;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime startsAt;

    private LocalDateTime endsAt;

    @OneToMany
    @JoinColumn(name = "closures")
    private List<Closure> closures;

    private String location;

    private Priority priority;

    public Report() {
    }

    public Report(String title, User author, Incident incident) {
        this(-1L, title, author, incident);
    }

    public Report(Long id, String title, User author, Incident incident) {
        this(-1L, title, author, incident, LocalDateTime.now());
    }

    public Report(Long id, String title, User author, Incident incident, LocalDateTime startsAt) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.incident = incident;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = createdAt;
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

    public List<Closure> getClosures() {
        return closures;
    }

    public void setClosures(List<Closure> closures) {
        this.closures = closures;
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
}
