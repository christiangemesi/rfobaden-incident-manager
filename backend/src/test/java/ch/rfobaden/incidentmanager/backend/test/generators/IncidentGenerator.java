package ch.rfobaden.incidentmanager.backend.test.generators;

import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.test.generators.base.ModelGenerator;
import org.springframework.boot.test.context.TestComponent;

@TestComponent
public class IncidentGenerator extends ModelGenerator<Incident> {
    private final CloseReasonGenerator closeReasonGenerator;

    public IncidentGenerator(CloseReasonGenerator closeReasonGenerator) {
        this.closeReasonGenerator = closeReasonGenerator;
    }

    @Override
    public Incident generateNew() {
        Incident incident = new Incident();
        incident.setTitle(faker.funnyName().name());
        incident.setDescription(doMaybe(() -> faker.lorem().sentence(10)));

        incident.setStartsAt(doMaybe(this::randomDateTime));
        incident.setEndsAt(doMaybe(this::randomDateTime));

        incident.setCloseReason(doMaybe(closeReasonGenerator::generate));
        incident.setClosed(faker.bool().bool());

        return incident;
    }
}
