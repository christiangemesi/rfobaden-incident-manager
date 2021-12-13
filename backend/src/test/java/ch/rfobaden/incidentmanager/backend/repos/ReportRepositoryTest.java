package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.models.paths.ReportPath;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepositoryTest;
import ch.rfobaden.incidentmanager.backend.services.IncidentService;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
public class ReportRepositoryTest extends
    ModelRepositoryTest<Report, ReportPath, ReportRepository> {

    @Autowired
    IncidentService incidentService;

    @Autowired
    UserService userService;

    @Override
    protected void saveRelations(Report report) {
        var incident = report.getIncident();
        if (incident != null) {
            report.setIncident(incidentService.create(incident.toPath(), incident));
        }

        var assignee = report.getAssignee();
        if (assignee != null) {
            report.setAssignee(userService.create(assignee));
        }
    }
}
