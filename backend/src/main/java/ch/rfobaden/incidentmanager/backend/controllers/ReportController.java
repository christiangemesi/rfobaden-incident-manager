package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.controllers.data.CompletionData;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.repos.IncidentRepository;
import ch.rfobaden.incidentmanager.backend.services.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
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

    private final IncidentRepository incidentRepository;

    @Autowired
    public ReportController(ReportService reportService, IncidentRepository incidentRepository) {
        this.reportService = reportService;
        this.incidentRepository = incidentRepository;
    }

    @GetMapping
    public List<Report> getReports(@PathVariable("incidentId") Long incidentId) {
        if (!incidentRepository.existsById(incidentId)) {
            throw new IllegalArgumentException("incident not found");
        }
        return reportService.getAllReportsOfIncidentById(incidentId).orElseThrow(() -> (
                new ApiException(HttpStatus.NOT_FOUND, "report not found")
        ));
    }

    @GetMapping({"{reportId}"})
    public Report getReportById(
            @PathVariable("incidentId") Long incidentId, @PathVariable("reportId") Long reportId
    ) {
        boolean incidentExists = incidentRepository.existsById(incidentId);
        Incident incidentOfId = incidentRepository.findById(incidentId).orElse(null);
        if (!incidentExists || incidentOfId == null) {
            throw new IllegalArgumentException("incident not found");
        }

        return reportService.getReportOfIncidentById(incidentId, reportId).orElseThrow(() -> (
                new ApiException(HttpStatus.NOT_FOUND, "report not found")
        ));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    public Report addNewReport(@Param("incidentId") Long incidentId, @RequestBody Report report) {
        if (!incidentRepository.existsById(incidentId)) {
            throw new IllegalArgumentException("incident not found");
        }
        return reportService.addNewReport(report);
    }

    @PutMapping("{reportId}/close")
    @ResponseStatus(HttpStatus.OK)
    public Report closeReport(
            @PathVariable("incidentId") Long incidentId,
            @PathVariable("reportId") Long reportId,
            @RequestBody CompletionData completionData
    ) {
        if (!incidentRepository.existsById(incidentId)) {
            throw new IllegalArgumentException("incident not found");
        }
        return reportService.closeReport(reportId, completionData)
                .orElseThrow(() -> (
                        new ApiException(HttpStatus.NOT_FOUND, "incident not found")
                ));
    }

    @PutMapping("{reportId}/reopen")
    @ResponseStatus(HttpStatus.OK)
    public Report reopenReport(
            @PathVariable("incidentId") Long incidentId,
            @PathVariable("reportId") Long reportId
    ) {
        if (!incidentRepository.existsById(incidentId)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "incident not found");
        }

        Report report = reportService.getReportById(reportId).orElseThrow(() -> (
                new ApiException(HttpStatus.NOT_FOUND, "report not found")
        ));

        if (!report.getIncidentId().equals(incidentId)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "no report with incident id found");
        }
        return reportService.reopenReport(report).orElseThrow(
                () -> new ApiException(HttpStatus.NOT_FOUND, "report not found"));
    }

    @DeleteMapping("{reportId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReportById(
            @PathVariable("incidentId") Long incidentId,
            @PathVariable("reportId") Long reportId
    ) {
        if (!incidentRepository.existsById(incidentId)) {
            throw new IllegalArgumentException("incident not found");
        }
        if (!reportService.deleteReportById(reportId)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "report not found");
        }
    }
}
