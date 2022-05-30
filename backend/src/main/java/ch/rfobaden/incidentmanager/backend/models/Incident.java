package ch.rfobaden.incidentmanager.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

/**
 * {@code Incident} represents any major event handled via the IncidentManager.
 * It is further divided into {@link Transport} and {@link Report} entities.
 */
@Entity
@Table(name = "incident")
public class Incident extends ClosableModel
    implements ImageOwner, DocumentOwner {

    /**
     * The reason for closing the incident.
     * It is {@code null} if the incident has never been {@link ClosableModel#isClosed() closed}.
     */
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "close_reason_id")
    private CloseReason closeReason;

    /**
     * The {@link Report reports} of the incident.
     */
    @OneToMany(mappedBy = "incident", cascade = CascadeType.REMOVE)
    private List<Report> reports = new ArrayList<>();


    /**
     * The {@link Transport transports} of the incident.
     */
    @OneToMany(mappedBy = "incident", cascade = CascadeType.REMOVE)
    private List<Transport> transports = new ArrayList<>();

    /**
     * The images attached to the incident, stored as {@link Document} instances.
     */
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Document> images = new ArrayList<>();

    /**
     * The {@link Document documents} attached to the incident.
     * Does not include the incident's {@link #images image documents}.
     */
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Document> documents = new ArrayList<>();

    public CloseReason getCloseReason() {
        return closeReason;
    }

    public void setCloseReason(CloseReason closeReason) {
        this.closeReason = closeReason;
    }

    /**
     * Whether the incident is done.
     * An incident is done when all its {@link #getTransports() transports}
     * and {@link #getReports() reports} are all closed or done.
     *
     * @return Whether the incident is done.
     */
    @JsonProperty("isDone")
    public boolean isDone() {
        return (!getTransports().isEmpty() || !getReports().isEmpty())
            && getTransports().stream().allMatch(Transport::isClosed)
            && (getReports().stream().allMatch(Report::isClosed)
                || getReports().stream().allMatch(Report::isDone));
    }

    @JsonIgnore
    public List<Report> getReports() {
        return reports;
    }

    /**
     * Lists the {@link Report#getId() ids} of all closed {@link #getReports() reports}.
     *
     * @return The ids of all closed reports.
     */
    public List<Long> getClosedReportIds() {
        return getReports().stream()
            .filter(r -> r.isClosed() || r.isDone())
            .map(Report::getId)
            .collect(Collectors.toList());
    }

    /**
     * Lists the {@link Report#getId() ids} of all {@link #getReports()} reports}.
     *
     * @return The ids of all reports.
     */
    public List<Long> getReportIds() {
        return getReports().stream().map(Report::getId).collect(Collectors.toList());
    }

    @JsonIgnore
    public void setReports(List<Report> reports) {
        this.reports = reports;
    }

    @JsonIgnore
    public List<Transport> getTransports() {
        return transports;
    }

    @JsonIgnore
    public void setTransports(List<Transport> transports) {
        this.transports = transports;
    }

    /**
     * Lists the {@link Transport#getId() ids} of all {@link #getTransports() transports}.
     *
     * @return The ids of all transports.
     */
    public List<Long> getTransportIds() {
        return getTransports().stream().map(Transport::getId).collect(Collectors.toList());
    }
    
    /**
     * Lists the {@link Report#getId() ids} of all closed {@link #getTransports() transports}.
     *
     * @return The ids of all closed transports.
     */
    public List<Long> getClosedTransportIds() {
        return getTransports().stream()
            .filter(Transport::isClosed)
            .map(Transport::getId)
            .collect(Collectors.toList());
    }

    @Override
    public List<Document> getImages() {
        return images;
    }

    @Override
    public List<Document> getDocuments() {
        return documents;
    }

    @Override
    public void setDocuments(List<Document> documents) {
        this.documents = documents;
    }

    @Override
    public void setImages(List<Document> images) {
        this.images = images;
    }

    /**
     * Creates the set of the ids of all {@link Organization organizations}
     * that are connected to this incident.
     *
     * @return The set of ids of all connected organizations.
     */
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    public Set<Long> getOrganizationIds() {
        return Stream.concat(
                Stream.concat(
                    Stream.concat(
                        reports.stream(),
                        transports.stream()
                    ),
                    reports.stream()
                        .map(Report::getTasks)
                        .flatMap(Collection::stream)
                ),
                reports.stream()
                    .map(Report::getTasks)
                    .flatMap(Collection::stream)
                    .map(Task::getSubtasks)
                    .flatMap(Collection::stream)
            )
            .map(Trackable::getAssignee)
            .filter(Objects::nonNull)
            .map(User::getOrganizationId)
            .filter(Objects::nonNull)
            .collect(Collectors.toUnmodifiableSet());
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof Incident)) {
            return false;
        }
        var incident = (Incident) other;
        return equalsClosableModel(other)
            && Objects.equals(closeReason, incident.closeReason);
    }

    @Override
    public int hashCode() {
        return Objects.hash(closableModelHashCode(), closeReason);
    }
}
