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
        SubtaskPath that = (SubtaskPath) o;
        return Objects.equals(taskId, that.taskId)
            && super.equals(that);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), taskId);
    }

    @Override
    public String toString() {
        return "SubtaskPath{"
            + "incidentId=" + getIncidentId()
            + ", reportId=" + getReportId()
            + ", taskId=" + taskId
            + '}';
    }
}
