package ch.rfobaden.incidentmanager.backend.repos;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.models.Subtask;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.models.paths.SubtaskPath;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepositoryTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.stream.Collectors;

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

    @Test
    void testAllByFindAssignee() {
        // Given
        var amount = 10;
        var records = generator.generate(amount);
        User user = null;
        records.forEach(this::saveRelations);
        for (int i = 0; user == null && i < Math.random() * (amount - 1) + 1; i++) {
            user = records.get(i).getAssignee();
        }
        var assignee = user;

        records = repository.saveAll(records);
        var assignedRecords = records.stream()
            .filter(e -> e.getAssignee() == assignee
                && !e.getTask().getReport().getIncident().isClosed()
            ).collect(Collectors.toList());

        // When
        var result = repository.findAllByAssignee(user);

        // Then
        assertThat(result.size()).isEqualTo(assignedRecords.size());
        for (Subtask subtask : result) {
            assertThat(subtask).isIn(assignedRecords);
        }
        for (Subtask subtask : assignedRecords) {
            assertThat(subtask).isIn(result);
        }
    }
}
