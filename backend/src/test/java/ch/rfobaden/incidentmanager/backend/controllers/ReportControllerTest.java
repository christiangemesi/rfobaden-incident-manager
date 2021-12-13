package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.controllers.base.ModelControllerTest;
import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.models.paths.ReportPath;
import ch.rfobaden.incidentmanager.backend.services.IncidentService;
import ch.rfobaden.incidentmanager.backend.services.ReportService;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Optional;

@WebMvcTest(ReportController.class)
public class ReportControllerTest extends ModelControllerTest<Report, ReportPath, ReportService> {
    @Autowired
    protected UserService userService;

    @MockBean
    IncidentService incidentService;

    @Override
    protected String getEndpointFor(ReportPath reportPath) {
        return "/api/v1/incidents/" + reportPath.getIncidentId() + "/reports/";
    }

    @Override
    protected void mockRelations(ReportPath reportPath, Report report) {
        Mockito.when(incidentService.find(reportPath, reportPath.getIncidentId()))
            .thenReturn(Optional.of(report.getIncident()));

        var assignee = report.getAssignee();
        if (assignee != null) {
            Mockito.when(userService.find(assignee.getId()))
                .thenReturn(Optional.of(assignee));
        }
    }
}








