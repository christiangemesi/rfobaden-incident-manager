package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.controllers.base.AppControllerTest;
import ch.rfobaden.incidentmanager.backend.controllers.base.ModelControllerTest;
import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.models.paths.ReportPath;
import ch.rfobaden.incidentmanager.backend.services.IncidentService;
import ch.rfobaden.incidentmanager.backend.services.ReportService;
import org.mockito.Mockito;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;

import java.util.Optional;

@WebMvcTest(ReportController.class)
@Import(AppControllerTest.SecurityContextMock.class)
public class ReportControllerTest extends ModelControllerTest<Report, ReportPath, ReportService> {

    @MockBean
    IncidentService incidentService;

    @Override
    protected String getEndpointFor(ReportPath reportPath) {
        return "/api/v1/incidents/" + reportPath.getIncidentId() + "/reports/";
    }

    @Override
    protected void mockPopulate(ReportPath reportPath, Report record) {
        Mockito.when(incidentService.find(reportPath, reportPath.getIncidentId()))
            .thenReturn(Optional.of(record.getIncident()));
    }
}








