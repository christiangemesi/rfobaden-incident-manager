package ch.rfobaden.incidentmanager.backend.test.generators;

import ch.rfobaden.incidentmanager.backend.models.CloseReason;
import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.test.generators.base.ModelGenerator;
import org.springframework.boot.test.context.TestComponent;

import java.time.LocalDateTime;

@TestComponent
public class IncidentGenerator extends ModelGenerator<Incident> {
    @Override
    public Incident generateNew() {
        Incident incident = new Incident();
        incident.setTitle(faker.funnyName().name());
        incident.setDescription(faker.lorem().sentence(10));
        // TODO do some fancy stuff do daisychain closeReasons randomly
        CloseReason closeReason = new CloseReason();
        closeReason.setMessage(faker.animal().name());
        closeReason.setCreatedAt(LocalDateTime.now().minusDays(faker.random()
                .nextInt(0, 365 * 1000)));
        incident.setCloseReason(closeReason);
        incident.setClosed(faker.bool().bool());
        incident.setStartsAt(LocalDateTime.now().minusDays(faker.random().nextInt(0, 365 * 1000)));
        if (faker.bool().bool()) {
            incident.setEndsAt(
                LocalDateTime.now().minusDays(faker.random().nextInt(0, 365 * 1000)));
        }
        return incident;
    }
}
