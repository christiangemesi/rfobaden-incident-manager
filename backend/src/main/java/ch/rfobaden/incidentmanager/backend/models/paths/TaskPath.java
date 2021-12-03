package ch.rfobaden.incidentmanager.backend.models.paths;

import java.util.Objects;

// TODO extend ReportPath
public class TaskPath {
    private Long incidentId;

    private Long reportId;

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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        TaskPath taskPath = (TaskPath) o;
        return Objects.equals(incidentId, taskPath.incidentId)
                && Objects.equals(reportId, taskPath.reportId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(incidentId, reportId);
    }

    @Override
    public String toString() {
        return "TaskPath{"
            + "incidentId=" + incidentId
            + ", reportId=" + reportId
            + '}';
    }
}
