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
        if (task != null) {
            task.getReport().setIncident(incidentRepository.save(task.getReport().getIncident()));
            task.setReport(reportRepository.save(task.getReport()));
            subtask.setTask(taskRepository.save(task));
        }
    }
}
