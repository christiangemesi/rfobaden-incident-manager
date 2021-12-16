package ch.rfobaden.incidentmanager.backend.models.paths;

import java.util.Objects;

public class ReportPath extends EmptyPath {
    private Long incidentId;

    public Long getIncidentId() {
        return incidentId;
    }

    public void setIncidentId(Long incidentId) {
        this.incidentId = incidentId;
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (! (other instanceof ReportPath)) {
            return false;
        }
        ReportPath that = (ReportPath) other;
        return Objects.equals(incidentId, that.incidentId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(incidentId);
    }

    @Override
    public String toString() {
        return "ReportPath{"
            + "incidentId=" + incidentId
            + '}';
    }
}
