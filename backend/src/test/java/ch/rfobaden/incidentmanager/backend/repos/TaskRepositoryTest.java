package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.models.Task;
import ch.rfobaden.incidentmanager.backend.models.paths.TaskPath;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepositoryTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
public class TaskRepositoryTest extends
    ModelRepositoryTest<Task, TaskPath, TaskRepository> {

    @Autowired
    ReportRepository reportRepository;

    @Autowired
    IncidentRepository incidentRepository;

    @Autowired
    UserRepository userRepository;

    @Override
    protected void saveRelations(Task task) {
        var assignee = task.getAssignee();
        if (assignee != null) {
            task.setAssignee(userRepository.save(assignee));
        }

        var report = task.getReport();
        var reportAssignee = report.getAssignee();
        if (reportAssignee != null) {
            report.setAssignee(userRepository.save(reportAssignee));
        }

        report.setIncident(incidentRepository.save(report.getIncident()));
        task.setReport(reportRepository.save(report));
    }
}
