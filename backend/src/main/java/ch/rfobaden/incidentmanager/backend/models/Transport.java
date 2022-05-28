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
import javax.validation.constraints.Size;


@Entity
@Table(name = "transport")
public final class Transport extends TrackableModel implements PathConvertible<TransportPath> {
    @ManyToOne
    @JoinColumn(nullable = false)
    private Incident incident;

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

    @Size(min = 1, max = 100)
    private String pointOfDeparture;

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
    public Long getAssigneeId() {
        if (getAssignee() == null) {
            return null;
        }
        return getAssignee().getId();
    }

    @Override
    public void setAssigneeId(Long id) {
        if (id == null) {
            setAssignee(null);
            return;
        }
        setAssignee(new User());
        getAssignee().setId(id);
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


