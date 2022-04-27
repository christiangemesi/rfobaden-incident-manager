package ch.rfobaden.incidentmanager.backend.repos;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.models.Task;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.models.paths.TaskPath;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepositoryTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.stream.Collectors;

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
            .filter(e -> e.getAssignee() == assignee && !e.getReport().getIncident().isClosed())
            .collect(Collectors.toList());

        // When
        var result = repository.findAllByAssignee(user);

        // Then
        assertThat(result.size()).isEqualTo(assignedRecords.size());
        for (Task task : result) {
            assertThat(task).isIn(assignedRecords);
        }
        for (Task task : assignedRecords) {
            assertThat(task).isIn(result);
        }
    }
}
