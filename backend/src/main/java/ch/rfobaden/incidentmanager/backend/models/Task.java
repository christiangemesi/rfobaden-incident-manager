package ch.rfobaden.incidentmanager.backend.models;

import ch.rfobaden.incidentmanager.backend.models.paths.PathConvertible;
import ch.rfobaden.incidentmanager.backend.models.paths.TaskPath;
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
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
@Table(name = "task")
public class Task extends Model
    implements PathConvertible<TaskPath>, Trackable, ImageOwner, Serializable {
    private static final long serialVersionUID = 1L;

    @ManyToOne
    @JoinColumn
    private User assignee;

    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Report report;

    @Size(max = 100)
    @NotBlank
    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDateTime startsAt;

    private LocalDateTime endsAt;

    @Size(max = 100)
    private String location;

    @NotNull
    @Column(nullable = false)
    private boolean isClosed;

    @NotNull
    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false)
    private Priority priority;

    @OneToMany(mappedBy = "task", cascade = CascadeType.REMOVE)
    private List<Subtask> subtasks = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Image> images = new ArrayList<>();

    @Override
    public List<Image> getImages() {
        return images;
    }

    @Override
    public void setImages(List<Image> images) {
        this.images = images;
    }

    @JsonIgnore
    @Override
    public User getAssignee() {
        return assignee;
    }

    @Override
    public void setAssignee(User assignee) {
        this.assignee = assignee;
    }

    @JsonIgnore
    public Report getReport() {
        return report;
    }

    @JsonProperty
    public Long getReportId() {
        if (report == null) {
            return null;
        }
        return report.getId();
    }

    @JsonProperty
    public Long getIncidentId() {
        if (report == null) {
            return null;
        }
        return report.getIncident().getId();
    }

    @JsonProperty
    public void setReport(Report report) {
        this.report = report;
    }

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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    @Override
    public Priority getPriority() {
        return priority;
    }

    @Override
    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    @JsonIgnore
    public List<Subtask> getSubtasks() {
        return subtasks;
    }

    @JsonIgnore
    public void setSubtasks(List<Subtask> subtasks) {
        this.subtasks = subtasks;
    }

    public List<Long> getSubtaskIds() {
        return getSubtasks().stream().map(Subtask::getId).collect(Collectors.toList());
    }

    public List<Long> getClosedSubtaskIds() {
        return getSubtasks().stream()
            .filter(Subtask::isClosed)
            .map(Subtask::getId)
            .collect(Collectors.toList());
    }

    @JsonProperty("isDone")
    public boolean isDone() {
        return !getSubtasks().isEmpty()
            && getSubtasks().stream().allMatch(Subtask::isClosed);
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
        return getReport().getLink() + "/auftraege/" + getId();
    }

    @Override
    public String getFullTitle() {
        return getReport().getFullTitle() + "/" + getTitle();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Task task = (Task) o;
        return equalsModel(task)
            && Objects.equals(assignee, task.assignee)
            && Objects.equals(report, task.report)
            && Objects.equals(title, task.title)
            && Objects.equals(description, task.description)
            && Objects.equals(startsAt, task.startsAt)
            && Objects.equals(endsAt, task.endsAt)
            && Objects.equals(isClosed, task.isClosed)
            && Objects.equals(location, task.location)
            && priority == task.priority;
    }

    @Override
    public int hashCode() {
        return Objects.hash(
            modelHashCode(),
            assignee,
            report,
            title,
            description,
            startsAt,
            endsAt,
            location,
            isClosed,
            priority
        );
    }


    @Override
    public TaskPath toPath() {
        var path = new TaskPath();
        path.setIncidentId(getReport().getIncident().getId());
        path.setReportId(getReport().getId());
        return path;
    }
}
