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
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * {@code Transport} represents a transport handled in an {@link Incident}.
 * It is not further divided.
 */
@Entity
@Table(name = "transport")
public final class Transport extends Model implements PathConvertible<TransportPath>, Trackable,
    Serializable {

    /**
     * The {@link User assignee} responsible for the completion of the transport.
     */
    @ManyToOne
    @JoinColumn
    private User assignee;

    /**
     * The {@link Incident} the transport belongs to.
     */
    @ManyToOne
    @JoinColumn(nullable = false)
    private Incident incident;

    /**
     * The title of the transport.
     */
    @Size(max = 100)
    @NotBlank
    @Column(nullable = false)
    private String title;

    /**
     * A textual description of what the transport is about.
     */
    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * Whether the transport is closed.
     * A closed transport counts as completed.
     */
    @NotNull
    @Column(nullable = false)
    private boolean isClosed;

    /**
     * The number of people involved in the transport.
     */
    @Min(0)
    private long peopleInvolved;

    /**
     * The person who drives the transport.
     */
    @Size(min = 1, max = 100)
    private String driver;

    /**
     * The vehicle which is driven.
     */
    @NotNull
    @ManyToOne(cascade = {
        CascadeType.REFRESH,
        CascadeType.DETACH,
        CascadeType.MERGE
    })
    @JoinColumn(nullable = false)
    private Vehicle vehicle;

    /**
     * The trailer which is needed, null if none is needed.
     */
    @ManyToOne(cascade = {
        CascadeType.REFRESH,
        CascadeType.DETACH,
        CascadeType.MERGE
    })
    @JoinColumn
    private Trailer trailer;

    /**
     * The departure location of the transport.
     */
    @Size(min = 1, max = 100)
    private String pointOfDeparture;

    /**
     * The arrival location of the transport.
     */
    @Size(min = 1, max = 100)
    private String pointOfArrival;

    /**
     * The moment in time at which the transport will start.
     * This represents the actual time at which the real-life event
     * managed in this entity will start.
     * <p>
     * This is used to plan a transport in advance.
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
     * The priority of the transport.
     */
    @NotNull
    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false)
    private Priority priority;

    public User getAssignee() {
        return assignee;
    }

    public void setAssignee(User assignee) {
        this.assignee = assignee;
    }

    /**
     * Allows access to the {@link #getAssignee() assignee}'s id.
     * Is {@code null} if there's currently no assignee.
     *
     * @return The assignee's id.
     */
    public Long getAssigneeId() {
        if (assignee == null) {
            return null;
        }
        return assignee.getId();
    }

    /**
     * Sets the {@link #getAssignee() assignee}'s id.
     * If there's no assignee, a new user will be created using the specified id.
     * If the id is {@code null}, the assignee will be removed.
     *
     * @param id The assignee's new id.
     */
    public void setAssigneeId(Long id) {
        if (id == null) {
            assignee = null;
            return;
        }
        assignee = new User();
        assignee.setId(id);
    }

    @JsonIgnore
    public Incident getIncident() {
        return incident;
    }

    @JsonIgnore
    public void setIncident(Incident incident) {
        this.incident = incident;
    }

    /**
     * Allows access to the {@link #getIncident() incident}'s id.
     *
     * @return The incident's id.
     */
    public Long getIncidentId() {
        if (incident == null) {
            return null;
        }
        return incident.getId();
    }

    /**
     * Sets the {@link #getIncident()} () incident}'s id.
     *
     * @param id The incident's new id.
     */
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

    @Override
    public boolean isClosed() {
        return isClosed;
    }

    @Override
    public void setClosed(boolean closed) {
        isClosed = closed;
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

    /**
     * Allows access to the {@link #getVehicle()() vehilce}'s id.
     *
     * @return The vehicle's id.
     */
    public Long getVehicleId() {
        if (vehicle == null) {
            return null;
        }
        return vehicle.getId();
    }

    /**
     * Sets the {@link #getVehicle() vehicle}'s id.
     *
     * @param id The vehicle's new id.
     */
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

    /**
     * Allows access to the {@link #getTrailer() trailer}'s id.
     * Is {@code null} if there's currently no trailer.
     *
     * @return The trailer's id.
     */
    public Long getTrailerId() {
        if (trailer == null) {
            return null;
        }
        return trailer.getId();
    }

    /**
     * Sets the {@link #getTrailer() trailer}'s id.
     * If the id is {@code null}, the trailer will be removed.
     *
     * @param id The trailer's new id.
     */
    public void setTrailerId(Long id) {
        if (id == null) {
            trailer = null;
            return;
        }
        trailer = new Trailer();
        trailer.setId(id);
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
    public Priority getPriority() {
        return priority;
    }

    @Override
    public void setPriority(Priority priority) {
        this.priority = priority;
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


