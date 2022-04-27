package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.models.paths.ReportPath;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepositoryTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
public class ReportRepositoryTest extends
    ModelRepositoryTest<Report, ReportPath, ReportRepository> {

    @Autowired
    IncidentRepository incidentRepository;

    @Autowired
    UserRepository userRepository;

    @Override
    protected void saveRelations(Report report) {
        var incident = report.getIncident();
        if (incident != null) {
            report.setIncident(incidentRepository.save(incident));
        }

        var assignee = report.getAssignee();
        if (assignee != null) {
            report.setAssignee(userRepository.save(assignee));
        }
    }

    @Override
    protected void alignAfterCreate(Report record, Report result) {
        var entryType = record.getEntryType();
        var entryTypeResult = result.getEntryType();
        if (entryType != null && entryTypeResult != null) {
            entryType.setId(entryTypeResult.getId());
        }
    }
}
