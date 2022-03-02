package ch.rfobaden.incidentmanager.backend.models.paths;

import java.util.Objects;

public class TransportPath extends EmptyPath {
    private Long incidentId;


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        TransportPath that = (TransportPath) o;
        return Objects.equals(incidentId, that.incidentId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(incidentId);
    }

    public Long getIncidentId() {
        return incidentId;
    }

    public void setIncidentId(Long incidentId) {
        this.incidentId = incidentId;
    }
}
