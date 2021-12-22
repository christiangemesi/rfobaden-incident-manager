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
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (! (other instanceof SubtaskPath)) {
            return false;
        }
        SubtaskPath that = (SubtaskPath) other;
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
