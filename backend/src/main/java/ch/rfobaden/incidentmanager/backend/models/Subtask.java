package ch.rfobaden.incidentmanager.backend.models;

import ch.rfobaden.incidentmanager.backend.models.paths.PathConvertible;
import ch.rfobaden.incidentmanager.backend.models.paths.SubtaskPath;
import com.fasterxml.jackson.annotation.JsonIgnore;

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
@Table(name = "subtask")
public class Subtask extends Model
    implements PathConvertible<SubtaskPath>, Trackable, Serializable {
    private static final long serialVersionUID = 1L;

    @ManyToOne
    @JoinColumn
    private User assignee;

    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Task task;

    @Size(max = 100)
    @NotBlank
    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDateTime startsAt;

    private LocalDateTime endsAt;

    @NotNull
    @Column(nullable = false)
    private boolean isClosed;

    @NotNull
    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false)
    private Priority priority;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Image> images = new ArrayList<>();

    public List<Image> getImages() {
        return images;
    }

    @JsonIgnore
    public void setImages(List<Image> images) {
        this.images = images;
    }

    public List<Long> getImageIds() {
        return getImages().stream().map(Image::getId).collect(Collectors.toList());
    }

    public boolean addImage(Image image) {
        return images.add(image);
    }

    @JsonIgnore
    public User getAssignee() {
        return assignee;
    }

    @Override
    public void setAssignee(User assignee) {
        this.assignee = assignee;
    }

    public Long getTaskId() {
        if (task == null) {
            return null;
        }
        return task.getId();
    }

    public Long getReportId() {
        if (task == null) {
            return null;
        }
        return task.getReportId();
    }

    public Long getIncidentId() {
        if (task == null) {
            return null;
        }
        return task.getReport().getIncidentId();
    }

    @JsonIgnore
    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
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
        return getTask().getLink() + "/unterauftraege/" + getId();
    }

    @Override
    public String getFullTitle() {
        return getTask().getFullTitle() + "/" + getTitle();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Subtask subtask = (Subtask) o;
        return equalsModel(subtask)
            && Objects.equals(assignee, subtask.assignee)
            && Objects.equals(task, subtask.task)
            && Objects.equals(title, subtask.title)
            && Objects.equals(description, subtask.description)
            && Objects.equals(startsAt, subtask.startsAt)
            && Objects.equals(endsAt, subtask.endsAt)
            && Objects.equals(isClosed, subtask.isClosed)
            && priority == subtask.priority;
    }

    @Override
    public int hashCode() {
        return Objects.hash(
            modelHashCode(),
            assignee,
            task,
            title,
            description,
            startsAt,
            endsAt,
            priority,
            isClosed
        );
    }

    @Override
    public SubtaskPath toPath() {
        var path = new SubtaskPath();
        path.setIncidentId(getTask().getReport().getIncidentId());
        path.setReportId(getTask().getReportId());
        path.setTaskId(getTaskId());
        return path;
    }
}
