package ch.rfobaden.incidentmanager.backend.models.paths;

import java.util.Objects;

public class TaskPath extends ReportPath {
    private Long reportId;

    public Long getReportId() {
        return reportId;
    }

    public void setReportId(Long reportId) {
        this.reportId = reportId;
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (other == null || getClass() != other.getClass()) {
            return false;
        }
        TaskPath that = (TaskPath) other;
        return Objects.equals(reportId, that.reportId)
            && super.equals(that);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), reportId);
    }

    @Override
    public String toString() {
        return "TaskPath{"
            + "incidentId=" + getIncidentId()
            + ", reportId=" + reportId
            + '}';
    }
}
