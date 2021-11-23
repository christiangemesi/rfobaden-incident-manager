package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.controllers.base.AppController;
import ch.rfobaden.incidentmanager.backend.controllers.data.CompletionData;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.services.IncidentService;
import ch.rfobaden.incidentmanager.backend.services.ReportService;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "api/v1/incidents/{incidentId}/reports")
public class ReportController extends AppController {

    private final ReportService reportService;

    private final IncidentService incidentService;

    private final UserService userService;

    public ReportController(
        ReportService reportService,
        IncidentService incidentService,
        UserService userService
    ) {
        this.reportService = reportService;
        this.incidentService = incidentService;
        this.userService = userService;
    }

    @GetMapping
    public List<Report> getReports(@PathVariable("incidentId") Long incidentId) {
        if (incidentService.getIncidentById(incidentId).isEmpty()) {
            throw new IllegalArgumentException("incident not found");
        }
        return reportService.getReportsOfIncident(incidentId);
    }

    @GetMapping({"{reportId}"})
    public Report getReportById(
        @PathVariable("incidentId") Long incidentId,
        @PathVariable("reportId") Long reportId
    ) {
        return reportService.getReportOfIncidentById(incidentId, reportId).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "report not found")
        ));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    public Report addNewReport(
        @PathVariable("incidentId") Long incidentId,
        @RequestBody Report report
    ) {
        report.setAuthor(getCurrentUser().orElseThrow(() -> (
            new ApiException(HttpStatus.UNAUTHORIZED, "not signed in")
        )));
        prepareReport(report, incidentId);
        return reportService.addNewReport(report);
    }

    @PutMapping("{reportId}")
    @ResponseStatus(HttpStatus.OK)
    public Report updateReport(
        @PathVariable("incidentId") Long incidentId,
        @PathVariable("reportId") Long reportId,
        @RequestBody Report report
    ) {
        prepareReport(report, incidentId);
        return reportService.updateReport(reportId, report).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "incident not found")
        ));
    }

    @PutMapping("{reportId}/close")
    @ResponseStatus(HttpStatus.OK)
    public Report closeReport(
        @PathVariable("incidentId") Long incidentId,
        @PathVariable("reportId") Long reportId,
        @RequestBody CompletionData completionData
    ) {
        return reportService.closeReportOfIncident(
            incidentId, reportId, completionData.getReason()
        ).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "incident not found")
        ));
    }

    @PutMapping("{reportId}/reopen")
    @ResponseStatus(HttpStatus.OK)
    public Report reopenReport(
        @PathVariable("incidentId") Long incidentId,
        @PathVariable("reportId") Long reportId
    ) {
        return reportService.reopenReportOfIncident(incidentId, reportId).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "report not found")
        ));
    }

    @DeleteMapping("{reportId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReportById(
        @PathVariable("incidentId") Long incidentId,
        @PathVariable("reportId") Long reportId
    ) {
        reportService.getReportOfIncidentById(incidentId, reportId).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "report not found")
        ));
        if (!reportService.deleteReportById(reportId)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "report not found");
        }
    }

    private void prepareReport(Report report, Long incidentId) {
        report.setIncident(incidentService.getIncidentById(incidentId).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "incident not found")
        )));
        if (report.getAssigneeId() != null) {
            report.setAssignee(userService.find(report.getAssigneeId()).orElseThrow(() -> (
                new ApiException(HttpStatus.UNPROCESSABLE_ENTITY, "assignee not found")
            )));
        }
    }
}
