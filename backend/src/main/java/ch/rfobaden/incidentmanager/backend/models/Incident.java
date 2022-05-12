package ch.rfobaden.incidentmanager.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
@Table(name = "incident")
public class Incident extends Model.Basic
    implements Describable, Closeable, DateTimeBounded, ImageOwner, DocumentOwner, Serializable {

    private static final long serialVersionUID = 1L;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull
    @Column(nullable = false)
    private boolean isClosed;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "close_reason_id")
    private CloseReason closeReason;

    private LocalDateTime startsAt;

    private LocalDateTime endsAt;

    @OneToMany(mappedBy = "incident", cascade = CascadeType.REMOVE)
    private List<Report> reports = new ArrayList<>();

    @OneToMany(mappedBy = "incident", cascade = CascadeType.REMOVE)
    private List<Transport> transports = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Document> images = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Document> documents = new ArrayList<>();

    @Override
    public String getTitle() {
        return title;
    }

    @Override
    public void setTitle(String title) {
        this.title = title;
    }

    @Override
    public String getDescription() {
        return description;
    }

    @Override
    public void setDescription(String description) {
        this.description = description;
    }

    public CloseReason getCloseReason() {
        return closeReason;
    }

    public void setCloseReason(CloseReason closeReason) {
        this.closeReason = closeReason;
    }

    @Override
    public boolean isClosed() {
        return isClosed;
    }

    @Override
    public void setClosed(boolean closed) {
        isClosed = closed;
    }

    @JsonProperty("isDone")
    public boolean isDone() {
        return !getReports().isEmpty()
            && getTransports().stream().allMatch(Transport::isClosed)
            && (getReports().stream().allMatch(Report::isClosed)
            || getReports().stream().allMatch(Report::isDone));
    }

    @JsonIgnore
    public List<Report> getReports() {
        return reports;
    }

    @JsonIgnore
    public void setReports(List<Report> reports) {
        this.reports = reports;
    }

    public List<Long> getReportIds() {
        return getReports().stream().map(Report::getId).collect(Collectors.toList());
    }

    public List<Long> getClosedReportIds() {
        return getReports().stream()
            .filter(r -> r.isClosed() || r.isDone())
            .map(Report::getId)
            .collect(Collectors.toList());
    }

    @JsonIgnore
    public List<Transport> getTransports() {
        return transports;
    }

    @JsonIgnore
    public void setTransports(List<Transport> transports) {
        this.transports = transports;
    }

    public List<Long> getTransportIds() {
        return getTransports().stream().map(Transport::getId).collect(Collectors.toList());
    }

    public List<Long> getClosedTransportIds() {
        return getTransports().stream()
            .filter(Transport::isClosed)
            .map(Transport::getId)
            .collect(Collectors.toList());
    }

    @Override
    public LocalDateTime getStartsAt() {
        return startsAt;
    }

    @Override
    public void setStartsAt(LocalDateTime startsAt) {
        this.startsAt = startsAt;
    }

    @Override
    public LocalDateTime getEndsAt() {
        return endsAt;
    }

    @Override
    public void setEndsAt(LocalDateTime endsAt) {
        this.endsAt = endsAt;
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

    public Set<Long> getOrganizationIds() {
        return Stream.concat(
                Stream.concat(
                    reports.stream(),
                    reports.stream()
                        .map(Report::getTasks)
                        .flatMap(Collection::stream)
                ),
                reports.stream()
                    .map(Report::getTasks)
                    .flatMap(Collection::stream)
                    .map(Task::getSubtasks)
                    .flatMap(Collection::stream)
            ).map(trackable -> trackable.getAssignee().getOrganizationId())
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
        return equalsModel(incident)
            && Objects.equals(title, incident.title)
            && Objects.equals(description, incident.description)
            && Objects.equals(startsAt, incident.startsAt)
            && Objects.equals(endsAt, incident.endsAt)
            && Objects.equals(closeReason, incident.closeReason)
            && Objects.equals(isClosed, incident.isClosed);
    }

    @Override
    public int hashCode() {
        return Objects.hash(modelHashCode(), title, description, startsAt, endsAt,
            closeReason, isClosed);
    }
}
