package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepositoryTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
class IncidentRepositoryTest
    extends ModelRepositoryTest.Basic<Incident, IncidentRepository> {

    @Override
    protected void alignAfterCreate(Incident record, Incident result) {
        var closeReason = record.getCloseReason();
        var closeReasonResult = result.getCloseReason();
        while (closeReason != null && closeReasonResult != null) {
            closeReason.setId(closeReasonResult.getId());
            closeReason = closeReason.getPrevious();
            closeReasonResult = closeReasonResult.getPrevious();
        }
    }
}
