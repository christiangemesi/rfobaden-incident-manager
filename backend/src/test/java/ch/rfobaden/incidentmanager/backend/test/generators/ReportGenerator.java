package ch.rfobaden.incidentmanager.backend.test.generators;

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
        report.setAssignee(userGenerator.generate());
        report.setTitle(faker.funnyName().name());
        report.setDescription(faker.lorem().sentence(10));
        report.setNotes(faker.lorem().sentence(10));
        // TODO starts at and ends at?
        report.setLocation(faker.country().capital());
        report.setKeyReport(faker.bool().bool());
        report.setLocationRelevantReport(faker.bool().bool());
        report.setPriority(Report.Priority.MEDIUM); // TODO all generated are medium
        report.setIncident(incidentGenerator.generate());
        return report;
    }
}
