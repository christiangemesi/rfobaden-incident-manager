package ch.rfobaden.incidentmanager.backend.models.paths;

import java.util.Objects;

public class SubtaskPath extends TaskPath {

    private Long taskId;

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        if (!super.equals(o)) {
            return false;
        }
        SubtaskPath that = (SubtaskPath) o;
        return Objects.equals(taskId, that.taskId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), taskId);
    }

    @Override
    public String toString() {
        return "SubtaskPath{"
            // TODO: check with or without super call?
            + super.toString()
            + "taskId=" + taskId
            + '}';
    }
}
