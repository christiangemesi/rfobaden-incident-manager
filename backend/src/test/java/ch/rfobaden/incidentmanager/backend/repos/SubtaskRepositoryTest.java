package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.models.Subtask;
import ch.rfobaden.incidentmanager.backend.models.paths.SubtaskPath;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepositoryTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
public class SubtaskRepositoryTest extends
    ModelRepositoryTest<Subtask, SubtaskPath, SubtaskRepository> {

    @Autowired
    TaskRepository taskRepository;

    @Autowired
    ReportRepository reportRepository;

    @Autowired
    IncidentRepository incidentRepository;

    @Autowired
    UserRepository userRepository;

    @Override
    protected void saveRelations(Subtask subtask) {
        var assignee = subtask.getAssignee();
        if (assignee != null) {
            subtask.setAssignee(userRepository.save(assignee));
        }

        var task = subtask.getTask();
        var taskAssignee = task.getAssignee();
        if (taskAssignee != null) {
            task.setAssignee(userRepository.save(taskAssignee));
        }

        var report = task.getReport();
        report.setIncident(incidentRepository.save(report.getIncident()));
        var reportAssignee = report.getAssignee();
        if (reportAssignee != null) {
            report.setAssignee(userRepository.save(reportAssignee));
        }
        task.setReport(reportRepository.save(report));

        subtask.setTask(taskRepository.save(task));
    }
}
