package ch.rfobaden.incidentmanager.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
@Table(name = "incident")
public class Incident extends Model.Basic implements Serializable {
    private static final long serialVersionUID = 1L;

    @Size(max = 100, message = "title can contain max 100 characters")
    @NotBlank(message = "title must not be empty")
    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDateTime startsAt;

    private LocalDateTime endsAt;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "close_reason_id")
    private CloseReason closeReason;

    @NotNull(message = "isClosed must be defined")
    @Column(nullable = false)
    private boolean isClosed;

    @OneToMany(mappedBy = "incident", cascade = CascadeType.REMOVE)
    private List<Report> reports = new ArrayList<>();

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

    public CloseReason getCloseReason() {
        return closeReason;
    }

    public void setCloseReason(CloseReason closeReason) {
        this.closeReason = closeReason;
    }

    @JsonProperty("isClosed")
    public boolean isClosed() {
        return isClosed;
    }

    public void setClosed(boolean closed) {
        isClosed = closed;
    }

    @JsonProperty("isDone")
    public boolean isDone() {
        return !getReports().isEmpty()
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
