package ch.rfobaden.incidentmanager.backend.test.generators;

import ch.rfobaden.incidentmanager.backend.models.CloseReason;
import ch.rfobaden.incidentmanager.backend.test.generators.base.Generator;
import org.springframework.boot.test.context.TestComponent;

@TestComponent
public class CloseReasonGenerator extends Generator<CloseReason> {
    @Override
    public CloseReason generate() {
        CloseReason reason = new CloseReason();
        reason.setMessage(faker.harryPotter().quote());
        reason.setCreatedAt(randomDateTime());
        reason.setPrevious(doMaybe(this::generate));
        return reason;
    }
}
