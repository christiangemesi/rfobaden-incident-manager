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
        incident.setDescription(doMaybe(() -> faker.lorem().sentence(10)));

        incident.setStartsAt(doMaybe(this::randomDateTime));
        incident.setEndsAt(doMaybe(this::randomDateTime));

        incident.setCloseReason(doMaybe(this::generateCloseReason));
        incident.setClosed(faker.bool().bool());

        return incident;
    }

    private CloseReason generateCloseReason() {
        CloseReason reason = new CloseReason();
        reason.setMessage(faker.animal().name());
        reason.setCreatedAt(randomDateTime());
        reason.setPrevious(doMaybe(this::generateCloseReason));
        return reason;
    }
}
