package ch.rfobaden.incidentmanager.backend.test.generators;

import ch.rfobaden.incidentmanager.backend.models.Session;
import ch.rfobaden.incidentmanager.backend.test.generators.base.Generator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestComponent;

@TestComponent
public class SessionGenerator extends Generator<Session> {
    @Autowired
    UserGenerator userGenerator;

    @Override
    public Session generate() {
        var user = userGenerator.generatePersisted();
        return new Session(user.getId());
    }

    @Override
    public Session copy(Session session) {
        // Needs an override, since Session does not have a default constructor.
        return new Session(session.getUserId(), session.getCreatedAt());
    }
}
