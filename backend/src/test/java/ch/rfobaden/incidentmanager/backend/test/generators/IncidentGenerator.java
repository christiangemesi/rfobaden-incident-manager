package ch.rfobaden.incidentmanager.backend.test.generators;

import java.time.LocalDateTime;

import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.test.generators.base.ModelGenerator;

public class IncidentGenerator extends ModelGenerator<Incident> {
    @Override
    public Incident generateNew() {
        Incident incident = new Incident();
        incident.setTitle(faker.funnyName().name());
        incident.setDescription(faker.lorem().sentence(100));
        incident.setClosed(faker.bool().bool());
        if (incident.isClosed()) {
            incident.setCloseReason(faker.lorem().sentence(5));
            incident.setClosedAt(
                LocalDateTime.now().minusDays(faker.random().nextInt(0, 365 * 1000)));
        }
        incident.setStartsAt(LocalDateTime.now().minusDays(faker.random().nextInt(0, 365 * 1000)));
        if (faker.bool().bool()) {
            incident.setEndsAt(
                LocalDateTime.now().minusDays(faker.random().nextInt(0, 365 * 1000)));
        }
        return incident;
    }
}
