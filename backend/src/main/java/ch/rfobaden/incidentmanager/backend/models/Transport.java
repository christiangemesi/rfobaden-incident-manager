package ch.rfobaden.incidentmanager.backend.models;

import ch.rfobaden.incidentmanager.backend.models.paths.PathConvertible;
import ch.rfobaden.incidentmanager.backend.models.paths.TransportPath;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;
import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;


@Entity
@Table(name = "Transport")
public final class Transport extends Model implements PathConvertible<TransportPath> {
    @ManyToOne
    @JoinColumn(nullable = false)
    private Incident incident;

    @Column(nullable = false)
    private String title;

    private long peopleInvolved;

    private String description;

    private String trailer;

    private LocalDateTime startsAt;
    private LocalDateTime endsAt;

    private String vehicle;

    private String destinationPlace;
    private String sourcePlace;

    @ManyToOne
    @JoinColumn
    private User assignee;

    @JsonIgnore
    public Incident getIncident() {
        return incident;
    }

    @JsonIgnore
    public void setIncident(Incident incident) {
        this.incident = incident;
    }

    public Long getIncidentId() {
        if (incident == null) {
            return null;
        }
        return incident.getId();
    }

    public void setIncidentId(Long id) {
        if (id == null) {
            incident = null;
            return;
        }
        incident = new Incident();
        incident.setId(id);
    }


    public String getVehicle() {
        return vehicle;
    }

    public void setVehicle(String vehicle) {
        this.vehicle = vehicle;
    }

    public String getDestinationPlace() {
        return destinationPlace;
    }

    public void setDestinationPlace(String destinationPlace) {
        this.destinationPlace = destinationPlace;
    }

    public String getSourcePlace() {
        return sourcePlace;
    }

    public void setSourcePlace(String sourcePlace) {
        this.sourcePlace = sourcePlace;
    }

    public long getPeopleInvolved() {
        return peopleInvolved;
    }

    public void setPeopleInvolved(long peopleInvolved) {
        this.peopleInvolved = peopleInvolved;
    }

    public String getTrailer() {
        return trailer;
    }

    public void setTrailer(String trailer) {
        this.trailer = trailer;
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

    public void setAssigneeId(Long id) {
        if (id == null) {
            assignee = null;
            return;
        }
        assignee = new User();
        assignee.setId(id);
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

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (other == null || getClass() != other.getClass()) {
            return false;
        }
        var that = (Transport) other;

        return equalsModel(that)
            && Objects.equals(title, that.title)
            && Objects.equals(incident, that.incident)
            && Objects.equals(peopleInvolved, that.peopleInvolved)
            && Objects.equals(description, that.description)
            && Objects.equals(trailer, that.trailer)
            && Objects.equals(startsAt, that.startsAt)
            && Objects.equals(endsAt, that.endsAt)
            && Objects.equals(vehicle, that.vehicle)
            && Objects.equals(destinationPlace, that.destinationPlace)
            && Objects.equals(sourcePlace, that.sourcePlace)
            && Objects.equals(assignee, that.assignee);
    }

    @Override
    public int hashCode() {
        return Objects.hash(title, incident, peopleInvolved, description, trailer,
            startsAt, endsAt, vehicle, destinationPlace, sourcePlace, assignee);
    }

    @Override
    public TransportPath toPath() {
        var path = new TransportPath();
        path.setIncidentId(getIncidentId());
        return path;
    }
}


