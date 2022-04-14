package ch.rfobaden.incidentmanager.backend.test.generators;

import ch.rfobaden.incidentmanager.backend.models.ReportType;
import ch.rfobaden.incidentmanager.backend.test.generators.base.Generator;
import org.springframework.boot.test.context.TestComponent;

@TestComponent
public class ReportTypeGenerator extends Generator<ReportType> {

    @Override
    public ReportType generate() {
        ReportType reportType = new ReportType();
        reportType.setId(faker.number().numberBetween(1, Long.MAX_VALUE));
        reportType.setType(faker.options().option(ReportType.Type.class));
        reportType.setNumber(faker.phoneNumber().cellPhone());
        return reportType;
    }
}
