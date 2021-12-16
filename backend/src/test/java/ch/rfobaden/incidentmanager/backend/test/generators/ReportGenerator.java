package ch.rfobaden.incidentmanager.backend.test.generators;

import ch.rfobaden.incidentmanager.backend.models.Priority;
import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.test.generators.base.ModelGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestComponent;

@TestComponent
public class ReportGenerator extends ModelGenerator<Report> {
    @Autowired
    IncidentGenerator incidentGenerator;

    @Autowired
    UserGenerator userGenerator;

    @Override
    public Report generateNew() {
        Report report = new Report();

        report.setTitle(faker.funnyName().name());
        report.setDescription(doMaybe(() -> faker.lorem().sentence(10)));
        report.setNotes(doMaybe(() -> faker.lorem().sentence(10)));
        report.setLocation(doMaybe(() -> faker.country().capital()));
        report.setKeyReport(faker.bool().bool());
        report.setLocationRelevantReport(faker.bool().bool());
        report.setPriority(faker.options().option(Report.Priority.class));

        report.setStartsAt(doMaybe(this::randomDateTime));
        report.setEndsAt(doMaybe(this::randomDateTime));

        report.setIncident(incidentGenerator.generate());
        report.setAssignee(doMaybe(userGenerator::generate));

        return report;
    }
}
