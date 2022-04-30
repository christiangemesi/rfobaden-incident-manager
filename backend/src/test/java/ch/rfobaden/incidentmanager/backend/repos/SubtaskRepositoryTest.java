package ch.rfobaden.incidentmanager.backend.repos;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import ch.rfobaden.incidentmanager.backend.models.Subtask;
import ch.rfobaden.incidentmanager.backend.models.paths.SubtaskPath;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepositoryTest;
import ch.rfobaden.incidentmanager.backend.test.generators.UserGenerator;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.ArrayList;

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

    @Autowired
    UserGenerator userGenerator;

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
    void testListWhereAssigneeId() {
        // Given
        var records = generator.generate(10);
        var assignedRecords = new ArrayList<Subtask>();
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
        var result = repository.listWhereAssigneeId(assignee.getId());

        // Then
        assertThat(result.size()).isEqualTo(assignedRecords.size());
        assertThat(result).asList().containsExactlyInAnyOrderElementsOf(assignedRecords);
    }
}
