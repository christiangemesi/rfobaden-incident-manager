package ch.rfobaden.incidentmanager.backend.models;

import ch.rfobaden.incidentmanager.backend.models.paths.PathConvertible;
import ch.rfobaden.incidentmanager.backend.models.paths.TransportPath;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;


@Entity
@Table(name = "transport")
public final class Transport extends Model implements PathConvertible<TransportPath>, Trackable,
    Serializable {
    @ManyToOne
    @JoinColumn(nullable = false)
    private Incident incident;

    @Column(nullable = false)
    private String title;
    private String description;

    @Min(0)
    private long peopleInvolved;
    @Size(min = 1, max = 100)
    private String driver;

    @ManyToOne(cascade = {
        CascadeType.REFRESH,
        CascadeType.DETACH,
        CascadeType.MERGE
    })
    @JoinColumn(nullable = false)
    private Vehicle vehicle;

    @ManyToOne(cascade = {
        CascadeType.REFRESH,
        CascadeType.DETACH,
        CascadeType.MERGE
    })
    @JoinColumn
    private Trailer trailer;

    private LocalDateTime startsAt;
    private LocalDateTime endsAt;

    @Size(min = 1, max = 100)
    private String pointOfDeparture;
    @Size(min = 1, max = 100)
    private String pointOfArrival;

    @ManyToOne
    @JoinColumn
    private User assignee;

    @NotNull
    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false)
    private Priority priority;

    @NotNull
    @Column(nullable = false)
    private boolean isClosed;

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

    public long getPeopleInvolved() {
        return peopleInvolved;
    }

    public void setPeopleInvolved(long peopleInvolved) {
        this.peopleInvolved = peopleInvolved;
    }

    public String getDriver() {
        return driver;
    }

    public void setDriver(String driver) {
        this.driver = driver;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public Long getVehicleId() {
        if (vehicle == null) {
            return null;
        }
        return vehicle.getId();
    }

    public void setVehicleId(Long id) {
        if (id == null) {
            vehicle = null;
            return;
        }
        vehicle = new Vehicle();
        vehicle.setId(id);
    }

    public Trailer getTrailer() {
        return trailer;
    }

    public void setTrailer(Trailer trailer) {
        this.trailer = trailer;
    }

    public Long getTrailerId() {
        if (trailer == null) {
            return null;
        }
        return trailer.getId();
    }

    public void setTrailerId(Long id) {
        if (id == null) {
            trailer = null;
            return;
        }
        trailer = new Trailer();
        trailer.setId(id);
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

    public String getPointOfDeparture() {
        return pointOfDeparture;
    }

    public void setPointOfDeparture(String sourcePlace) {
        this.pointOfDeparture = sourcePlace;
    }

    public String getPointOfArrival() {
        return pointOfArrival;
    }

    public void setPointOfArrival(String destinationPlace) {
        this.pointOfArrival = destinationPlace;
    }

    public User getAssignee() {
        return assignee;
    }

    public void setAssignee(User assignee) {
        this.assignee = assignee;
    }

    @Override
    public Long getAssigneeId() {
        if (assignee == null) {
            return null;
        }
        return assignee.getId();
    }

    @Override
    public void setAssigneeId(Long id) {
        if (id == null) {
            assignee = null;
            return;
        }
        assignee = new User();
        assignee.setId(id);
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
    public String getLink() {
        return "/ereignisse/" + getIncident().getId() + "/transporte/" + getId();
    }

    @Override
    public String getFullTitle() {
        return getIncident().getTitle() + "/" + getTitle();
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
            && Objects.equals(pointOfArrival, that.pointOfArrival)
            && Objects.equals(pointOfDeparture, that.pointOfDeparture)
            && Objects.equals(assignee, that.assignee);
    }

    @Override
    public int hashCode() {
        return Objects.hash(title, incident, peopleInvolved, description, trailer,
            startsAt, endsAt, vehicle, pointOfArrival, pointOfDeparture, assignee);
    }

    @Override
    public TransportPath toPath() {
        var path = new TransportPath();
        path.setIncidentId(getIncidentId());
        return path;
    }
}


