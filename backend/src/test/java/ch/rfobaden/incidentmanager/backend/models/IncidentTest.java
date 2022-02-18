package ch.rfobaden.incidentmanager.backend.models;

import static org.assertj.core.api.Assertions.assertThat;

import ch.rfobaden.incidentmanager.backend.models.base.ModelTest;
import ch.rfobaden.incidentmanager.backend.test.generators.ReportGenerator;
import ch.rfobaden.incidentmanager.backend.test.generators.SubtaskGenerator;
import ch.rfobaden.incidentmanager.backend.test.generators.TaskGenerator;
import org.junit.jupiter.api.RepeatedTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.stream.Collectors;

@SpringBootTest
class IncidentTest extends ModelTest<Incident> {
    @Autowired
    ReportGenerator reportGenerator;

    @Autowired
    TaskGenerator taskGenerator;

    @Autowired
    SubtaskGenerator subtaskGenerator;

    @RepeatedTest(5)
    public void testGetReportIds_notEmpty() {
        // Given
        var amount = (int) (Math.random() * 5) + 1;
        var value = generator.generate();
        value.getReports().addAll(reportGenerator.generate(amount));
        var allReportIds = value.getReports()
            .stream().map(Report::getId)
            .collect(Collectors.toList());

        // Then
        assertThat(value.getReportIds().containsAll(allReportIds)
            && allReportIds.containsAll(value.getReportIds())
        ).isTrue();
    }

    @RepeatedTest(5)
    public void testGetClosedReportIds_allReportsClosed() {
        // Given
        var amount = (int) (Math.random() * 5) + 1;
        var value = generator.generate();
        value.getReports().addAll(reportGenerator.generate(amount));
        value.getReports().forEach((report) -> {
            report.getTasks().add(taskGenerator.generate());
            report.getTasks().forEach((task) -> {
                task.getSubtasks().add(subtaskGenerator.generate());
                task.getSubtasks().get(0).setClosed(true);
            });
        });
        var allClosedReportIds = value.getReports()
            .stream().filter(Report::isClosed)
            .map(Report::getId)
            .collect(Collectors.toList());

        // Then
        assertThat(value.getClosedReportIds().containsAll(allClosedReportIds)
            && allClosedReportIds.containsAll(value.getClosedReportIds())
        ).isTrue();
    }

    @RepeatedTest(5)
    public void testGetClosedReportIds_someReportsClosed() {
        // Given
        var amount = (int) (Math.random() * 5) + 1;
        var value = generator.generate();
        value.getReports().addAll(reportGenerator.generate(amount));
        value.getReports().forEach((report) -> {
            report.getTasks().add(taskGenerator.generate());
            report.getTasks().forEach((task) -> {
                task.getSubtasks().add(subtaskGenerator.generate());
                task.getSubtasks().get(0).setClosed(Math.random() < 0.5);
            });
        });
        var allClosedReportIds = value.getReports()
            .stream().filter(Report::isClosed)
            .map(Report::getId)
            .collect(Collectors.toList());

        // Then
        assertThat(value.getClosedReportIds().containsAll(allClosedReportIds)
            && allClosedReportIds.containsAll(value.getClosedReportIds())
        ).isTrue();
    }

    @RepeatedTest(5)
    public void testGetClosedReportIds_noReportsClosed() {
        // Given
        var amount = (int) (Math.random() * 5) + 1;
        var value = generator.generate();
        value.getReports().addAll(reportGenerator.generate(amount));
        value.getReports().forEach((report) -> {
            report.getTasks().add(taskGenerator.generate());
            report.getTasks().forEach(
                (task) -> task.getSubtasks().add(subtaskGenerator.generate())
            );
        });

        // Then
        assertThat(value.getClosedReportIds().isEmpty()).isTrue();
    }
}
