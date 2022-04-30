package ch.rfobaden.incidentmanager.backend.repos;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.models.paths.ReportPath;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepositoryTest;
import ch.rfobaden.incidentmanager.backend.test.generators.UserGenerator;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.ArrayList;

@DataJpaTest
public class ReportRepositoryTest extends
    ModelRepositoryTest<Report, ReportPath, ReportRepository> {

    @Autowired
    IncidentRepository incidentRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserGenerator userGenerator;

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

    @Test
    void testListWhereAssigneeId() {
        // Given
        var records = generator.generate(10);
        var assignedRecords = new ArrayList<Report>();
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
