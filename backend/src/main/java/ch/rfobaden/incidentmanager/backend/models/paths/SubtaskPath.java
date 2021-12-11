package ch.rfobaden.incidentmanager.backend.models.paths;

import java.util.Objects;

public class SubtaskPath extends TaskPath {

    private Long incidentId;
    private Long reportId;
    private Long taskId;

    public Long getIncidentId() {
        return incidentId;
    }

    public void setIncidentId(Long incidentId) {
        this.incidentId = incidentId;
    }

    public Long getReportId() {
        return reportId;
    }

    public void setReportId(Long reportId) {
        this.reportId = reportId;
    }

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
        SubtaskPath subtaskPath = (SubtaskPath) o;
        return Objects.equals(incidentId, subtaskPath.incidentId)
            && Objects.equals(reportId, subtaskPath.reportId)
            && Objects.equals(taskId, subtaskPath.taskId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(incidentId, reportId, taskId);
    }

    @Override
    public String toString() {
        return "TaskPath{"
            + "incidentId=" + incidentId
            + ", reportId=" + reportId
            + ", taskId=" + taskId
            + '}';
    }
}
