package ch.rfobaden.incidentmanager.backend.repos;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.models.paths.ReportPath;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepositoryTest;
import ch.rfobaden.incidentmanager.backend.test.generators.UserGenerator;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.stream.Collectors;

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
            .filter(e -> e.getAssignee() == assignee && !e.getIncident().isClosed())
            .collect(Collectors.toList());

        // When
        var result = repository.findAllByAssignee(user);

        // Then
        assertThat(result.size()).isEqualTo(assignedRecords.size());
        for (Report report : result) {
            assertThat(report).isIn(assignedRecords);
        }
        for (Report report : assignedRecords) {
            assertThat(report).isIn(result);
        }
    }
}
