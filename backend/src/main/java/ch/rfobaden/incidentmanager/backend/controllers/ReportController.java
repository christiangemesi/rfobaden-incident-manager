package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.controllers.data.CompletionData;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.services.IncidentService;
import ch.rfobaden.incidentmanager.backend.services.ReportService;
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
public class ReportController {

    private final ReportService reportService;

    private final IncidentService incidentService;

    public ReportController(ReportService reportService, IncidentService incidentService) {
        this.reportService = reportService;
        this.incidentService = incidentService;
    }

    @GetMapping
    public List<Report> getReports(@PathVariable("incidentId") Long incidentId) {
        if (incidentService.getIncidentById(incidentId).isEmpty()) {
            throw new IllegalArgumentException("incident not found");
        }
        return reportService.getAllReportsOfIncidentById(incidentId);
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
        report.setIncident(incidentService.getIncidentById(incidentId).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "incident not found")
        )));
        return reportService.addNewReport(report);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.OK)
    public Report updateReport(
        @PathVariable("incidentId") Long incidentId,
        @RequestBody Report report
    ) {
        report.setIncident(incidentService.getIncidentById(incidentId).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "incident not found")
        )));
        return reportService.updateReport(report).orElseThrow(() -> (
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
        Report report = loadReport(incidentId, reportId);
        return reportService.closeReport(report, completionData).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "incident not found")
        ));
    }

    @PutMapping("{reportId}/reopen")
    @ResponseStatus(HttpStatus.OK)
    public Report reopenReport(
        @PathVariable("incidentId") Long incidentId,
        @PathVariable("reportId") Long reportId
    ) {
        Report report = loadReport(incidentId, reportId);
        return reportService.reopenReport(report).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "report not found")
        ));
    }

    @DeleteMapping("{reportId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReportById(
        @PathVariable("incidentId") Long incidentId,
        @PathVariable("reportId") Long reportId
    ) {
        loadReport(incidentId, reportId);
        if (!reportService.deleteReportById(reportId)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "report not found");
        }
    }

    private Report loadReport(
        @PathVariable("incidentId") Long incidentId,
        @PathVariable("reportId") Long id
    ) {
        return reportService.getReportOfIncidentById(incidentId, id).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "report not found")
        ));
    }
}
