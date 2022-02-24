package ch.rfobaden.incidentmanager.backend.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;


@Entity
@Table(name = "transport")
public final class Transport extends Model.Basic {

    @ManyToOne
    @JoinColumn(nullable = false)
    private Incident incident;

    @ManyToOne
    @JoinColumn
    private User assignee;

    @Column(nullable = false)
    private Priority priority;

    @Column(nullable = false)
    private String title;

    private String description;
    private String note;
    private String location;

    private LocalDateTime startsAt;
    private LocalDateTime endsAt;

    @Column(nullable = false)
    private boolean isKeyReport;

    @Column(nullable = false)
    private boolean isLocationRelevantReport;

    public Incident getIncident() {
        return incident;
    }

    public void setIncident(Incident incident) {
        this.incident = incident;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
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

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public User getAssignee() {
        return assignee;
    }

    public void setAssignee(User assignee) {
        this.assignee = assignee;
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

    @JsonProperty("isKeyReport")
    public boolean isKeyReport() {
        return isKeyReport;
    }

    @JsonProperty("setKeyReport")
    public void setKeyReport(boolean keyReport) {
        isKeyReport = keyReport;
    }


    @JsonProperty("isLocationRelevantReport")
    public boolean isLocationRelevantReport() {
        return isLocationRelevantReport;
    }

    @JsonProperty("setLocationRelevantReport")
    public void setLocationRelevantReport(boolean locationRelevantReport) {
        isLocationRelevantReport = locationRelevantReport;
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
            && Objects.equals(isKeyReport, that.isKeyReport)
            && Objects.equals(isLocationRelevantReport, that.isLocationRelevantReport)
            && Objects.equals(priority, that.priority)
            && Objects.equals(title, that.title)
            && Objects.equals(description, that.description)
            && Objects.equals(note, that.note)
            && Objects.equals(location, that.location)
            && Objects.equals(assignee, that.assignee)
            && Objects.equals(startsAt, that.startsAt)
            && Objects.equals(endsAt, that.endsAt)
            && Objects.equals(incident, that.incident);
    }

    @Override
    public int hashCode() {
        return Objects.hash(priority, title, description, note,
            location, assignee, startsAt, endsAt,
            isKeyReport, isLocationRelevantReport, incident);
    }
}


