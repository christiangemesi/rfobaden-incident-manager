package ch.rfobaden.incidentmanager.backend.models;

import ch.rfobaden.incidentmanager.backend.models.paths.PathConvertible;
import ch.rfobaden.incidentmanager.backend.models.paths.TransportPath;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.Objects;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * {@code Transport} represents a transport handled in an {@link Incident}.
 */
@Entity
@Table(name = "transport")
public final class Transport extends TrackableModel implements PathConvertible<TransportPath> {

    /**
     * The {@link Incident} the transport belongs to.
     */
    @ManyToOne
    @JoinColumn(nullable = false)
    private Incident incident;

    /**
     * The number of people involved in the transport.
     */
    @Min(0)
    private long peopleInvolved;

    /**
     * The name of the person which will drive the vehicle of this transport.
     */
    @Size(min = 1, max = 100)
    private String driver;

    /**
     * The vehicle used in the transport.
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
     * The trailer used in the transport, or `null`, if none is needed.
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
     * Sets the {@link #getIncident() incident}'s id.
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
     * Allows access to the {@link #getVehicle() vehicle}'s id.
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

        return equalsTrackableModel(that)
            && Objects.equals(incident, that.incident)
            && Objects.equals(peopleInvolved, that.peopleInvolved)
            && Objects.equals(trailer, that.trailer)
            && Objects.equals(vehicle, that.vehicle)
            && Objects.equals(pointOfArrival, that.pointOfArrival)
            && Objects.equals(pointOfDeparture, that.pointOfDeparture);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
            trackableModelHashCode(),
            incident,
            peopleInvolved,
            trailer,
            vehicle,
            pointOfArrival,
            pointOfDeparture
        );
    }

    @Override
    public TransportPath toPath() {
        var path = new TransportPath();
        path.setIncidentId(getIncidentId());
        return path;
    }
}


