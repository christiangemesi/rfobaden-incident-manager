package ch.rfobaden.incidentmanager.backend.repos;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import ch.rfobaden.incidentmanager.backend.models.Task;
import ch.rfobaden.incidentmanager.backend.models.paths.TaskPath;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepositoryTest;
import ch.rfobaden.incidentmanager.backend.test.generators.UserGenerator;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.ArrayList;

@DataJpaTest
public class TaskRepositoryTest extends
    ModelRepositoryTest<Task, TaskPath, TaskRepository> {

    @Autowired
    ReportRepository reportRepository;

    @Autowired
    IncidentRepository incidentRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserGenerator userGenerator;

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
    void testListWhereAssigneeId() {
        // Given
        var records = generator.generate(10);
        var assignedRecords = new ArrayList<Task>();
        var assignee = userRepository.save(userGenerator.generate());

        for (var record : records) {
            record.setAssignee(null);
            if (generator.randomBoolean()) {
                record.setAssignee(assignee);
            }
            this.saveRelations(record);
            record = repository.save(record);
            if (record.getAssignee() != null) {
                assignedRecords.add(record);
            }
        }

        // When
        var result = repository.findAllByAssigneeId(assignee.getId());

        // Then
        assertThat(result.size()).isEqualTo(assignedRecords.size());
        assertThat(result).asList().containsExactlyInAnyOrderElementsOf(assignedRecords);
    }
}
