package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepositoryTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
public class IncidentRepositoryTest
    extends ModelRepositoryTest.Basic<Incident, IncidentRepository> {

    @Override
    protected void alignAfterCreate(Incident record, Incident result) {
        record.getCloseReason().setId(result.getCloseReason().getId());
    }
}
